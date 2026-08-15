import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { schema } from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

const client = postgres(databaseUrl, {
  prepare: false,
});

export const db = drizzle(client, { schema });
