"use server";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAgencyDb } from "../db";
import { cars } from "../schema";
import { idSchema, vehicleInputSchema, type VehicleInput } from "../validators";
import { requireAgencyOwner } from "../services/authorization";

export async function listVehicles() { const { agency } = await requireAgencyOwner(); return getAgencyDb().select().from(cars).where(eq(cars.agencyId, agency.id)).orderBy(desc(cars.createdAt)); }
export async function createVehicle(input: VehicleInput) {
  const parsed = vehicleInputSchema.safeParse(input); if (!parsed.success) return { success: false, message: "Please check the vehicle details." };
  try { const { agency } = await requireAgencyOwner(); const [vehicle] = await getAgencyDb().insert(cars).values({ ...parsed.data, imageUrl: parsed.data.imageUrl || null, agencyId: agency.id }).returning(); revalidatePath("/agency"); return { success: true, data: vehicle }; } catch { return { success: false, message: "Unable to add this vehicle right now." }; }
}
export async function updateVehicle(id: string, input: VehicleInput) {
  const parsedId = idSchema.safeParse(id); const parsed = vehicleInputSchema.safeParse(input); if (!parsedId.success || !parsed.success) return { success: false, message: "Please check the vehicle details." };
  try { const { agency } = await requireAgencyOwner(); const [vehicle] = await getAgencyDb().update(cars).set({ ...parsed.data, imageUrl: parsed.data.imageUrl || null, updatedAt: new Date() }).where(and(eq(cars.id, parsedId.data), eq(cars.agencyId, agency.id))).returning(); if (!vehicle) return { success: false, message: "Vehicle not found." }; revalidatePath("/agency"); return { success: true, data: vehicle }; } catch { return { success: false, message: "Unable to update this vehicle right now." }; }
}
export async function deleteVehicle(id: string) {
  const parsedId = idSchema.safeParse(id); if (!parsedId.success) return { success: false, message: "Invalid vehicle." };
  try { const { agency } = await requireAgencyOwner(); const [vehicle] = await getAgencyDb().delete(cars).where(and(eq(cars.id, parsedId.data), eq(cars.agencyId, agency.id))).returning({ id: cars.id }); if (!vehicle) return { success: false, message: "Vehicle not found." }; revalidatePath("/agency"); return { success: true, data: vehicle }; } catch { return { success: false, message: "Unable to remove this vehicle right now." }; }
}
