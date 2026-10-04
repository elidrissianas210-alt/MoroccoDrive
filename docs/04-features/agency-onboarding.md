# Agency Onboarding

After email verification, an agency account is sent to `/agency/onboarding`
when it has no agency profile. Agency registration creates the server-owned
profile with the `agency` role, so no role is written during onboarding. The
authenticated user submits the agency name, city, phone, business email,
description, and optional logo URL. The server validates the input, requires
the existing `agency` profile role, and creates an agency owned by the
authenticated user. Existing agency records are returned idempotently. Fleet
management is available only after the agency record exists.
