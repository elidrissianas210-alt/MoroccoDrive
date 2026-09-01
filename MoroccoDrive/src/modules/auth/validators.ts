import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const emailSchema = z.object({ email: z.string().trim().email("Enter a valid email address") });
export const passwordSchema = z.object({ password: z.string().min(8, "Password must be at least 8 characters").max(72) });
export type Credentials = z.infer<typeof credentialsSchema>;
