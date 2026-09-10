"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAgencyDb } from "../db";
import { agencies, profiles } from "../schema";
import { agencyInputSchema, agencyOnboardingSchema, type AgencyInput, type AgencyOnboardingInput } from "../validators";
import { requireAgencyOwner } from "../services/authorization";
import { createClient } from "@/lib/supabase/server";

export async function updateAgency(input: AgencyInput) {
  const parsed = agencyInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the agency details." };
  try {
    const { agency } = await requireAgencyOwner();
    const values = parsed.data;
    const [updated] = await getAgencyDb().update(agencies).set({ ...values, description: values.description || null, logoUrl: values.logoUrl || null, updatedAt: new Date() }).where(eq(agencies.id, agency.id)).returning();
    revalidatePath("/agency");
    return { success: true, data: updated };
  } catch { return { success: false, message: "Unable to update the agency right now." }; }
}

export async function createAgencyProfile(input: AgencyOnboardingInput) {
  const parsed = agencyOnboardingSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Please check your agency details." };
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, message: "You must be signed in to continue." };
    const database = getAgencyDb();
    const [profile] = await database.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
    if (profile && profile.role !== "agency") return { success: false as const, message: "This account is not an agency account." };
    if (!profile) {
      if (user.user_metadata?.requestedRole !== "agency") return { success: false as const, message: "This account is not registered as an agency." };
      await database.insert(profiles).values({ id: user.id, role: "agency" });
    }
    const [existing] = await database.select().from(agencies).where(eq(agencies.ownerId, user.id)).limit(1);
    if (existing) return { success: true as const, data: existing };
    const baseSlug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const [agency] = await database.insert(agencies).values({ ...parsed.data, ownerId: user.id, slug: `${baseSlug || "agency"}-${user.id.slice(0, 8)}`, description: parsed.data.description || null, logoUrl: parsed.data.logoUrl || null }).returning();
    revalidatePath("/agency");
    return { success: true as const, data: agency };
  } catch { return { success: false as const, message: "Unable to create the agency profile right now." }; }
}

export async function getAgencySetup() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authenticated: false as const, isAgency: false as const, agency: null };
  const database = getAgencyDb();
  const [profile] = await database.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  const isAgency = profile?.role === "agency" || user.user_metadata?.requestedRole === "agency";
  const [agency] = isAgency ? await database.select().from(agencies).where(eq(agencies.ownerId, user.id)).limit(1) : [];
  return { authenticated: true as const, isAgency, agency: agency ?? null };
}