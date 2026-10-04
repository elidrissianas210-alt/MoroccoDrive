import { describe, expect, it } from "vitest";
import { hasAgencyRole, ownsAgency } from "./policies";

describe("agency authorization policies", () => {
  it("authorizes only profiles with the server-owned agency role", () => {
    expect(hasAgencyRole({ role: "agency" })).toBe(true);
    expect(hasAgencyRole({ role: "customer" })).toBe(false);
    expect(hasAgencyRole(null)).toBe(false);
  });

  it("authorizes ownership only when the authenticated user owns the agency", () => {
    expect(ownsAgency("user-1", { ownerId: "user-1" })).toBe(true);
    expect(ownsAgency("user-1", { ownerId: "user-2" })).toBe(false);
    expect(ownsAgency("user-1", null)).toBe(false);
  });
});
