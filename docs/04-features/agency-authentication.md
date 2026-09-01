# Agency Authentication

Agency email/password authentication uses Supabase Auth and Server Actions.
The flow includes registration, email verification, login, password reset,
password recovery, and logout. Login checks the server-side `profiles.role`
value before redirecting to `/agency`; client-supplied roles are never trusted.
