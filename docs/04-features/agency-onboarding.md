# Agency Onboarding

After email verification, an agency account is sent to `/agency/onboarding`
when it has no agency profile. The authenticated user submits the agency name,
city, phone, business email, description, and optional logo URL. The server
validates the input, confirms the agency role, creates the profile role when
needed, and creates an agency owned by the authenticated user. Existing agency
records are returned idempotently. Fleet management is available only after
the agency record exists.
