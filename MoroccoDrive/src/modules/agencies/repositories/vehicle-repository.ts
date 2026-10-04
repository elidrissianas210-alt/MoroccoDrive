import { and, desc, eq } from "drizzle-orm";
import { cars } from "@/db/schema";
import { getAgencyDb } from "../db";

export async function listVehiclesByAgencyId(agencyId: string) {
  return getAgencyDb().select().from(cars).where(eq(cars.agencyId, agencyId)).orderBy(desc(cars.createdAt));
}

export async function findVehicleByIdAndAgencyId(id: string, agencyId: string) {
  return getAgencyDb().select({ id: cars.id }).from(cars).where(and(eq(cars.id, id), eq(cars.agencyId, agencyId))).limit(1).then(([vehicle]) => vehicle);
}

export async function createVehicle(values: typeof cars.$inferInsert) {
  const [vehicle] = await getAgencyDb().insert(cars).values(values).returning();
  return vehicle;
}

export async function updateVehicleByIdAndAgencyId(id: string, agencyId: string, values: Partial<typeof cars.$inferInsert>) {
  const [vehicle] = await getAgencyDb().update(cars).set(values).where(and(eq(cars.id, id), eq(cars.agencyId, agencyId))).returning();
  return vehicle;
}

export async function deleteVehicleByIdAndAgencyId(id: string, agencyId: string) {
  const [vehicle] = await getAgencyDb().delete(cars).where(and(eq(cars.id, id), eq(cars.agencyId, agencyId))).returning({ id: cars.id });
  return vehicle;
}
