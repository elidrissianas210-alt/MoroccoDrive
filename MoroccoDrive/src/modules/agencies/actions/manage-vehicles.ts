"use server";

import { revalidatePath } from "next/cache";
import { idSchema, vehicleInputSchema, type VehicleInput } from "../validators";
import { requireAgencyOwner } from "../services/authorization";
import { createFleetVehicle, deleteFleetVehicle, listFleet, updateFleetVehicle } from "../use-cases/vehicle-use-cases";

export async function listVehicles() {
  const { agency } = await requireAgencyOwner();
  return listFleet(agency.id);
}

export async function createVehicle(input: VehicleInput) {
  const parsed = vehicleInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the vehicle details." };
  try {
    const { agency } = await requireAgencyOwner();
    const vehicle = await createFleetVehicle(agency.id, parsed.data);
    revalidatePath("/agency");
    return { success: true, data: vehicle };
  } catch { return { success: false, message: "Unable to add this vehicle right now." }; }
}

export async function updateVehicle(id: string, input: VehicleInput) {
  const parsedId = idSchema.safeParse(id);
  const parsed = vehicleInputSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return { success: false, message: "Please check the vehicle details." };
  try {
    const { agency } = await requireAgencyOwner();
    const vehicle = await updateFleetVehicle(parsedId.data, agency.id, parsed.data);
    if (!vehicle) return { success: false, message: "Vehicle not found." };
    revalidatePath("/agency");
    return { success: true, data: vehicle };
  } catch { return { success: false, message: "Unable to update this vehicle right now." }; }
}

export async function deleteVehicle(id: string) {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { success: false, message: "Invalid vehicle." };
  try {
    const { agency } = await requireAgencyOwner();
    const vehicle = await deleteFleetVehicle(parsedId.data, agency.id);
    if (!vehicle) return { success: false, message: "Vehicle not found." };
    revalidatePath("/agency");
    return { success: true, data: vehicle };
  } catch { return { success: false, message: "Unable to remove this vehicle right now." }; }
}
