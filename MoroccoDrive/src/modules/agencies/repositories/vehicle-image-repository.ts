import { and, asc, eq } from "drizzle-orm";
import { carImages, cars } from "@/db/schema";
import { getAgencyDb } from "../db";

export async function listImagesByAgencyId(agencyId: string) {
  const rows = await getAgencyDb().select({ image: carImages }).from(carImages).innerJoin(cars, eq(carImages.carId, cars.id)).where(eq(cars.agencyId, agencyId)).orderBy(asc(carImages.sortOrder), asc(carImages.createdAt));
  return rows.map((row) => row.image);
}

export async function listSortOrdersByVehicleId(vehicleId: string) {
  return getAgencyDb().select({ sortOrder: carImages.sortOrder }).from(carImages).where(eq(carImages.carId, vehicleId));
}

export async function findImageByIdAndAgencyId(imageId: string, agencyId: string) {
  return getAgencyDb().select({ image: carImages }).from(carImages).innerJoin(cars, eq(carImages.carId, cars.id)).where(and(eq(carImages.id, imageId), eq(cars.agencyId, agencyId))).limit(1).then(([row]) => row?.image);
}

export async function createImages(values: Array<typeof carImages.$inferInsert>) {
  return getAgencyDb().insert(carImages).values(values).returning();
}

export async function deleteImageById(imageId: string) {
  await getAgencyDb().delete(carImages).where(eq(carImages.id, imageId));
}
