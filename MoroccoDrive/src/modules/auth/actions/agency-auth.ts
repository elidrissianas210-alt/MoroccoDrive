"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAgencyDb } from "@/modules/agencies/db";
import { profiles } from "@/modules/agencies/schema";
import { credentialsSchema, emailSchema, passwordSchema, type Credentials } from "../validators";

const failure = (message: string) => ({ success: false as const, message });

export async function registerAgency(input: Credentials) {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return failure("Enter a valid email and a password of at least 8 characters.");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { requestedRole: "agency" }, emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/agency/onboarding` } });
    if (error) return failure("Unable to create the agency account. Check the details and try again.");
    if (data.session && data.user) await ensureAgencyProfile(data.user.id);
    return { success: true as const, message: "Account created. Check your email to verify your account." };
  } catch { return failure("Unable to create the agency account right now."); }
}

export async function loginAgency(input: Credentials) {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return failure("Enter a valid email and password.");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) return failure("Incorrect email or password.");
    const [profile] = await getAgencyDb().select().from(profiles).where(eq(profiles.id, data.user.id)).limit(1);
    if (!profile || profile.role !== "agency") { await supabase.auth.signOut(); return failure("This account is not registered as an agency."); }
  } catch { return failure("Unable to sign in right now."); }
  redirect("/agency");
}

export async function requestAgencyPasswordReset(input: { email: string }) {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) return failure("Enter a valid email address.");
  try { const supabase = await createClient(); const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/agency/reset-password` }); if (error) return failure("Unable to send the reset email right now."); return { success: true as const, message: "If an account exists, a password reset email is on its way." }; } catch { return failure("Unable to send the reset email right now."); }
}

export async function updateAgencyPassword(input: { password: string }) {
  const parsed = passwordSchema.safeParse(input); if (!parsed.success) return failure("Password must be at least 8 characters.");
  try { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return failure("Your reset link is invalid or has expired."); const { error } = await supabase.auth.updateUser({ password: parsed.data.password }); if (error) return failure("Unable to update the password right now."); return { success: true as const, message: "Password updated. You can now sign in." }; } catch { return failure("Unable to update the password right now."); }
}

export async function logoutAgency() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/agency/login"); }

async function ensureAgencyProfile(userId: string) {
  const database = getAgencyDb();
  await database.insert(profiles).values({ id: userId, role: "agency" }).onConflictDoNothing();
}
