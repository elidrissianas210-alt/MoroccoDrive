"use server";

import { revalidatePath } from "next/cache";
import { agencyInputSchema, agencyOnboardingSchema, type AgencyInput, type AgencyOnboardingInput } from "../validators";
import { requireAgencyOwner, requireAgencyRole, getAgencyAccess } from "../services/authorization";
import { createAgencyProfile as createAgencyProfileUseCase, getAgencySetup as getAgencySetupUseCase, updateAgencyProfile } from "../use-cases/agency-use-cases";

export async function updateAgency(input: AgencyInput) {
  const parsed = agencyInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the agency details." };
  try {
    const { agency } = await requireAgencyOwner();
    const updated = await updateAgencyProfile(agency.id, parsed.data);
    revalidatePath("/agency");
    return { success: true, data: updated };
  } catch { return { success: false, message: "Unable to update the agency right now." }; }
}

export async function createAgencyProfile(input: AgencyOnboardingInput) {
  const parsed = agencyOnboardingSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Please check your agency details." };
  try {
    const { user } = await requireAgencyRole();
    const agency = await createAgencyProfileUseCase(user.id, parsed.data);
    revalidatePath("/agency");
    return { success: true as const, data: agency };
  } catch { return { success: false as const, message: "Unable to create the agency profile right now." }; }
}

export async function getAgencySetup() {
  const access = await getAgencyAccess();
  if (!access.user) return { authenticated: false as const, isAgency: false as const, agency: null };
  const { agency } = await getAgencySetupUseCase(access.user.id, access.isAgency);
  return { authenticated: true as const, isAgency: access.isAgency, agency };
}
