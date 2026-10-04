import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CarImage } from "@/db/schema";
import { listImagesByAgencyId } from "../repositories/vehicle-image-repository";
import { createVehicleImageSignedUrl } from "../services/image-storage";
import { listFleetImages } from "./vehicle-image-use-cases";

vi.mock("../repositories/vehicle-image-repository", () => ({
  listImagesByAgencyId: vi.fn(),
  listSortOrdersByVehicleId: vi.fn(),
  findImageByIdAndAgencyId: vi.fn(),
  createImages: vi.fn(),
  deleteImageById: vi.fn(),
}));

vi.mock("../repositories/vehicle-repository", () => ({
  findVehicleByIdAndAgencyId: vi.fn(),
}));

vi.mock("../services/image-storage", () => ({
  createVehicleImageSignedUrl: vi.fn(),
  uploadVehicleImage: vi.fn(),
  deleteVehicleImage: vi.fn(),
}));

function image(id: string, carId: string, sortOrder: number, createdAt: string): CarImage {
  return { id, carId, storagePath: `vehicles/${carId}/${id}.jpg`, publicUrl: `vehicles/${carId}/${id}.jpg`, sortOrder, createdAt: new Date(createdAt) };
}

describe("listFleetImages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads every image of the fleet with a single agency-scoped query", async () => {
    vi.mocked(listImagesByAgencyId).mockResolvedValue([
      image("img-a1", "car-a", 0, "2026-01-01T10:00:00Z"),
      image("img-b1", "car-b", 0, "2026-01-01T09:00:00Z"),
    ]);

    await listFleetImages("agency-1");

    expect(listImagesByAgencyId).toHaveBeenCalledTimes(1);
    expect(listImagesByAgencyId).toHaveBeenCalledWith("agency-1");
  });

  it("groups images by vehicle while preserving the repository order", async () => {
    vi.mocked(listImagesByAgencyId).mockResolvedValue([
      image("img-a1", "car-a", 0, "2026-01-01T10:00:00Z"),
      image("img-b1", "car-b", 0, "2026-01-01T09:00:00Z"),
      image("img-a2", "car-a", 1, "2026-01-01T11:00:00Z"),
      image("img-b2", "car-b", 1, "2026-01-01T12:00:00Z"),
    ]);
    vi.mocked(createVehicleImageSignedUrl).mockImplementation(async (storagePath) => `signed:${storagePath}`);

    const grouped = await listFleetImages("agency-1");

    expect(Object.keys(grouped)).toEqual(["car-a", "car-b"]);
    expect(grouped["car-a"].map((item) => item.id)).toEqual(["img-a1", "img-a2"]);
    expect(grouped["car-b"].map((item) => item.id)).toEqual(["img-b1", "img-b2"]);
  });

  it("keeps the cover image first and replaces publicUrl with the signed url", async () => {
    vi.mocked(listImagesByAgencyId).mockResolvedValue([
      image("img-a1", "car-a", 0, "2026-01-01T10:00:00Z"),
      image("img-a2", "car-a", 1, "2026-01-01T11:00:00Z"),
    ]);
    vi.mocked(createVehicleImageSignedUrl).mockImplementation(async (storagePath) => `signed:${storagePath}`);

    const grouped = await listFleetImages("agency-1");
    const [cover, second] = grouped["car-a"];

    expect(createVehicleImageSignedUrl).toHaveBeenCalledTimes(2);
    expect(createVehicleImageSignedUrl).toHaveBeenCalledWith("vehicles/car-a/img-a1.jpg");
    expect(cover.id).toBe("img-a1");
    expect(cover.publicUrl).toBe("signed:vehicles/car-a/img-a1.jpg");
    expect(cover.storagePath).toBe("vehicles/car-a/img-a1.jpg");
    expect(second.publicUrl).toBe("signed:vehicles/car-a/img-a2.jpg");
  });

  it("returns an empty map when the fleet has no images", async () => {
    vi.mocked(listImagesByAgencyId).mockResolvedValue([]);

    expect(await listFleetImages("agency-1")).toEqual({});
  });
});
