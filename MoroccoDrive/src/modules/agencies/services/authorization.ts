import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { getAgencyDb } from "../db";
import { agencies, profiles } from "@/db/schema";
import { hasAgencyRole, ownsAgency } from "@/lib/policies";

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getAgencyAccess() {
  const user = await getCurrentUser();
  if (!user) return { user: null, isAgency: false };

  const [profile] = await getAgencyDb().select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  return { user, isAgency: hasAgencyRole(profile) };
}
export async function requireAgencyRole() {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be signed in to manage an agency.");

  const [profile] = await getAgencyDb().select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  if (!hasAgencyRole(profile)) throw new Error("Only agency owners can perform this action.");

  return { user, profile };
}

export async function requireAgencyOwner() {
  const { user } = await requireAgencyRole();
  const [agency] = await getAgencyDb().select().from(agencies).where(eq(agencies.ownerId, user.id)).limit(1);
  if (!ownsAgency(user.id, agency)) throw new Error("Create an agency profile before managing vehicles.");
  return { user, agency };
}
