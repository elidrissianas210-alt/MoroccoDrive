import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", { id: uuid("id").primaryKey(), role: text("role").notNull().default("customer") });

export const agencies = pgTable("agencies", {
  id: uuid("id").defaultRandom().primaryKey(), ownerId: uuid("owner_id").notNull().references(() => profiles.id),
  name: text("name").notNull(), slug: text("slug").notNull().unique(), description: text("description"), city: text("city").notNull(),
  phone: text("phone").notNull(), email: text("email").notNull(), logoUrl: text("logo_url"), isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cars = pgTable("cars", {
  id: uuid("id").defaultRandom().primaryKey(), agencyId: uuid("agency_id").notNull().references(() => agencies.id), make: text("make").notNull(), model: text("model").notNull(),
  year: integer("year").notNull(), category: text("category").notNull(), transmission: text("transmission").notNull(), fuelType: text("fuel_type").notNull(), seats: integer("seats").notNull(),
  dailyPriceMad: integer("daily_price_mad").notNull(), registrationNumber: text("registration_number").notNull(), imageUrl: text("image_url"), isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const carImages = pgTable("car_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  carId: uuid("car_id").notNull().references(() => cars.id),
  storagePath: text("storage_path").notNull(),
  publicUrl: text("public_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
