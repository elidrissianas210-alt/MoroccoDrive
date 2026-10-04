import { findVehicleByIdAndAgencyId } from "../repositories/vehicle-repository";
import { createImages, deleteImageById, findImageByIdAndAgencyId, listImagesByVehicleId, listSortOrdersByVehicleId } from "../repositories/vehicle-image-repository";
import { createVehicleImageSignedUrl, deleteVehicleImage as deleteStoredVehicleImage, uploadVehicleImage } from "../services/image-storage";

const extensionByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function listFleetVehicleImages(agencyId: string, vehicleId: string) {
  const vehicle = await findVehicleByIdAndAgencyId(vehicleId, agencyId);
  if (!vehicle) return null;
  const images = await listImagesByVehicleId(vehicle.id);
  return Promise.all(images.map(async (image) => ({ ...image, publicUrl: await createVehicleImageSignedUrl(image.storagePath) })));
}

export async function uploadFleetVehicleImages(agencyId: string, vehicleId: string, files: File[]) {
  const vehicle = await findVehicleByIdAndAgencyId(vehicleId, agencyId);
  if (!vehicle) return null;
  const existing = await listSortOrdersByVehicleId(vehicle.id);
  const records: Array<{ carId: string; storagePath: string; publicUrl: string; sortOrder: number }> = [];
  for (const [index, file] of files.entries()) {
    const storagePath = `${agencyId}/${vehicle.id}/${crypto.randomUUID()}.${extensionByType[file.type]}`;
    await uploadVehicleImage(storagePath, file);
    records.push({ carId: vehicle.id, storagePath, publicUrl: storagePath, sortOrder: existing.length + index });
  }
  const inserted = await createImages(records);
  return Promise.all(inserted.map(async (image) => ({ ...image, publicUrl: await createVehicleImageSignedUrl(image.storagePath) })));
}

export async function deleteFleetVehicleImage(agencyId: string, imageId: string) {
  const image = await findImageByIdAndAgencyId(imageId, agencyId);
  if (!image) return { status: "not-found" as const };
  const removed = await deleteStoredVehicleImage(image.storagePath);
  if (removed.error) return { status: "storage-error" as const };
  await deleteImageById(imageId);
  return { status: "deleted" as const };
}
