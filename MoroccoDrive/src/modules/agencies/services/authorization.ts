import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { getAgencyDb } from "../db";
import { agencies, profiles } from "../schema";

export async function requireAgencyOwner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to manage an agency.");
  const [profile] = await getAgencyDb().select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  if (!profile || profile.role !== "agency") throw new Error("Only agency owners can perform this action.");
  const [agency] = await getAgencyDb().select().from(agencies).where(eq(agencies.ownerId, user.id)).limit(1);
  if (!agency) throw new Error("Create an agency profile before managing vehicles.");
  return { user, agency };
}
