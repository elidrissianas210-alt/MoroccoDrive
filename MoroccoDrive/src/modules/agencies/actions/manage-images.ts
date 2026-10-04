"use server";

import { revalidatePath } from "next/cache";
import { idSchema } from "../validators";
import { requireAgencyOwner } from "../services/authorization";
import { deleteFleetVehicleImage, listFleetVehicleImages, uploadFleetVehicleImages } from "../use-cases/vehicle-image-use-cases";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function listVehicleImages(vehicleId: string) {
  const parsed = idSchema.safeParse(vehicleId);
  if (!parsed.success) return [];
  try {
    const { agency } = await requireAgencyOwner();
    return (await listFleetVehicleImages(agency.id, parsed.data)) ?? [];
  } catch {
    return [];
  }
}

export async function uploadVehicleImages(vehicleId: string, formData: FormData) {
  const parsed = idSchema.safeParse(vehicleId);
  if (!parsed.success) return { success: false, message: "Invalid vehicle." };
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length) return { success: false, message: "Choose at least one image." };
  if (files.length > 10) return { success: false, message: "Upload up to 10 images at a time." };
  for (const file of files) if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) return { success: false, message: "Images must be JPG, PNG, or WebP files under 5 MB." };

  try {
    const { agency } = await requireAgencyOwner();
    const data = await uploadFleetVehicleImages(agency.id, parsed.data, files);
    if (!data) return { success: false, message: "Vehicle not found." };
    revalidatePath("/agency");
    return { success: true, data };
  } catch {
    return { success: false, message: "Unable to upload images. Check the vehicle-images storage bucket and try again." };
  }
}

export async function deleteVehicleImage(imageId: string) {
  const parsed = idSchema.safeParse(imageId);
  if (!parsed.success) return { success: false, message: "Invalid image." };
  try {
    const { agency } = await requireAgencyOwner();
    const result = await deleteFleetVehicleImage(agency.id, parsed.data);
    if (result.status === "not-found") return { success: false, message: "Image not found." };
    if (result.status === "storage-error") return { success: false, message: "Unable to remove the stored image." };
    revalidatePath("/agency");
    return { success: true, data: { id: parsed.data } };
  } catch {
    return { success: false, message: "Unable to remove this image right now." };
  }
}
