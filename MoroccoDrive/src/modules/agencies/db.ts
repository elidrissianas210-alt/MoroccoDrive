import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { agencies, carImages, cars, profiles } from "./schema";

function createAgencyDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Missing required environment variable: DATABASE_URL");
  const client = postgres(databaseUrl, { prepare: false });
  return drizzle(client, { schema: { agencies, carImages, cars, profiles } });
}

type AgencyDb = ReturnType<typeof createAgencyDb>;

type AgencyDbGlobal = typeof globalThis & {
  __moroccoDriveAgencyDb?: AgencyDb;
};

const globalForAgencyDb = globalThis as AgencyDbGlobal;

export function getAgencyDb(): AgencyDb {
  if (!globalForAgencyDb.__moroccoDriveAgencyDb) {
    globalForAgencyDb.__moroccoDriveAgencyDb = createAgencyDb();
  }
  return globalForAgencyDb.__moroccoDriveAgencyDb;
}