import { z } from "zod";

const textField = (label: string) => z.string().trim().min(1, `${label} is required`).max(120);
export const agencyInputSchema = z.object({ name: textField("Agency name"), description: z.string().trim().max(1000).optional(), city: textField("City"), phone: textField("Phone"), email: z.string().trim().email("Enter a valid email address"), logoUrl: z.string().url("Enter a valid logo URL").optional().or(z.literal("")) });
export const vehicleInputSchema = z.object({ make: textField("Make"), model: textField("Model"), year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1), category: z.enum(["SUV", "Sedan", "Hatchback", "Luxury", "Electric", "Van"]), transmission: z.enum(["Automatic", "Manual"]), fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric"]), seats: z.coerce.number().int().min(2).max(12), dailyPriceMad: z.coerce.number().int().min(1).max(100000), registrationNumber: textField("Registration number").max(30), imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")), isAvailable: z.boolean().default(true) });
export const idSchema = z.string().uuid();
export const agencyOnboardingSchema = agencyInputSchema.extend({ name: textField("Agency name").max(120) });
export type AgencyInput = z.infer<typeof agencyInputSchema>;
export type AgencyOnboardingInput = z.infer<typeof agencyOnboardingSchema>;
export type VehicleInput = z.infer<typeof vehicleInputSchema>;
