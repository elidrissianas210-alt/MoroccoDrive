import type { VehicleInput } from "../validators";
import { createVehicle, deleteVehicleByIdAndAgencyId, listVehiclesByAgencyId, updateVehicleByIdAndAgencyId } from "../repositories/vehicle-repository";

export function listFleet(agencyId: string) {
  return listVehiclesByAgencyId(agencyId);
}

export function createFleetVehicle(agencyId: string, input: VehicleInput) {
  return createVehicle({ ...input, imageUrl: input.imageUrl || null, agencyId });
}

export function updateFleetVehicle(vehicleId: string, agencyId: string, input: VehicleInput) {
  return updateVehicleByIdAndAgencyId(vehicleId, agencyId, { ...input, imageUrl: input.imageUrl || null, updatedAt: new Date() });
}

export function deleteFleetVehicle(vehicleId: string, agencyId: string) {
  return deleteVehicleByIdAndAgencyId(vehicleId, agencyId);
}
