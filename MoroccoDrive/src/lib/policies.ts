import type { Agency } from "@/db/schema";

export function hasAgencyRole(profile: { role: string } | null | undefined): boolean {
  return profile?.role === "agency";
}

export function ownsAgency(userId: string, agency: Pick<Agency, "ownerId"> | null | undefined): boolean {
  return agency?.ownerId === userId;
}
