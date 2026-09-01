"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAgencyDb } from "../db";
import { carImages, cars } from "../schema";
import { idSchema } from "../validators";
import { requireAgencyOwner } from "../services/authorization";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensionByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function listVehicleImages(vehicleId: string) {
  const parsed = idSchema.safeParse(vehicleId); if (!parsed.success) return [];
  try { const { agency } = await requireAgencyOwner(); const [vehicle] = await getAgencyDb().select({ id: cars.id }).from(cars).where(and(eq(cars.id, parsed.data), eq(cars.agencyId, agency.id))).limit(1); if (!vehicle) return []; const rows = await getAgencyDb().select().from(carImages).where(eq(carImages.carId, vehicle.id)).orderBy(asc(carImages.sortOrder), asc(carImages.createdAt)); const supabase = await createClient(); return Promise.all(rows.map(async (image) => { const signed = await supabase.storage.from("vehicle-images").createSignedUrl(image.storagePath, 3600); return { ...image, publicUrl: signed.data?.signedUrl ?? image.publicUrl }; })); } catch { return []; }
}

export async function uploadVehicleImages(vehicleId: string, formData: FormData) {
  const parsed = idSchema.safeParse(vehicleId); if (!parsed.success) return { success: false, message: "Invalid vehicle." };
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length) return { success: false, message: "Choose at least one image." };
  if (files.length > 10) return { success: false, message: "Upload up to 10 images at a time." };
  for (const file of files) if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) return { success: false, message: "Images must be JPG, PNG, or WebP files under 5 MB." };
  try {
    const { agency } = await requireAgencyOwner(); const database = getAgencyDb(); const [vehicle] = await database.select({ id: cars.id }).from(cars).where(and(eq(cars.id, parsed.data), eq(cars.agencyId, agency.id))).limit(1); if (!vehicle) return { success: false, message: "Vehicle not found." };
    const existing = await database.select({ sortOrder: carImages.sortOrder }).from(carImages).where(eq(carImages.carId, vehicle.id)); const supabase = await createClient(); const records = [];
    for (const [index, file] of files.entries()) { const storagePath = `${agency.id}/${vehicle.id}/${crypto.randomUUID()}.${extensionByType[file.type]}`; const upload = await supabase.storage.from("vehicle-images").upload(storagePath, file, { contentType: file.type, upsert: false }); if (upload.error) throw upload.error; const signed = await supabase.storage.from("vehicle-images").createSignedUrl(storagePath, 3600); records.push({ carId: vehicle.id, storagePath, publicUrl: signed.data?.signedUrl ?? storagePath, sortOrder: existing.length + index }); }
    const inserted = await database.insert(carImages).values(records).returning(); revalidatePath("/agency"); return { success: true, data: inserted };
  } catch { return { success: false, message: "Unable to upload images. Check the vehicle-images storage bucket and try again." }; }
}

export async function deleteVehicleImage(imageId: string) {
  const parsed = idSchema.safeParse(imageId); if (!parsed.success) return { success: false, message: "Invalid image." };
  try { const { agency } = await requireAgencyOwner(); const database = getAgencyDb(); const [image] = await database.select({ image: carImages, carAgencyId: cars.agencyId }).from(carImages).innerJoin(cars, eq(carImages.carId, cars.id)).where(and(eq(carImages.id, parsed.data), eq(cars.agencyId, agency.id))).limit(1); if (!image) return { success: false, message: "Image not found." }; const supabase = await createClient(); const removed = await supabase.storage.from("vehicle-images").remove([image.image.storagePath]); if (removed.error) return { success: false, message: "Unable to remove the stored image." }; await database.delete(carImages).where(eq(carImages.id, parsed.data)); revalidatePath("/agency"); return { success: true, data: { id: parsed.data } }; } catch { return { success: false, message: "Unable to remove this image right now." }; }
}
