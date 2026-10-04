import { eq } from "drizzle-orm";
import { agencies } from "@/db/schema";
import { getAgencyDb } from "../db";

export async function findAgencyByOwnerId(ownerId: string) {
  return getAgencyDb().select().from(agencies).where(eq(agencies.ownerId, ownerId)).limit(1).then(([agency]) => agency);
}

export async function createAgency(values: typeof agencies.$inferInsert) {
  const [agency] = await getAgencyDb().insert(agencies).values(values).returning();
  return agency;
}

export async function updateAgencyById(id: string, values: Partial<typeof agencies.$inferInsert>) {
  const [agency] = await getAgencyDb().update(agencies).set(values).where(eq(agencies.id, id)).returning();
  return agency;
}
