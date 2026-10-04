import type { AgencyInput, AgencyOnboardingInput } from "../validators";
import { createAgency, findAgencyByOwnerId, updateAgencyById } from "../repositories/agency-repository";

function slugFor(name: string, ownerId: string) {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (baseSlug || "agency") + "-" + ownerId.slice(0, 8);
}

export async function createAgencyProfile(ownerId: string, input: AgencyOnboardingInput) {
  const existing = await findAgencyByOwnerId(ownerId);
  if (existing) return existing;
  return createAgency({ ...input, ownerId, slug: slugFor(input.name, ownerId), description: input.description || null, logoUrl: input.logoUrl || null });
}

export async function updateAgencyProfile(agencyId: string, input: AgencyInput) {
  return updateAgencyById(agencyId, { ...input, description: input.description || null, logoUrl: input.logoUrl || null, updatedAt: new Date() });
}

export async function getAgencySetup(ownerId: string, isAgency: boolean) {
  return { agency: isAgency ? (await findAgencyByOwnerId(ownerId)) ?? null : null };
}
