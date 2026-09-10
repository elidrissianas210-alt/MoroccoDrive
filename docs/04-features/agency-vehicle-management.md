# Agency and Vehicle Management

The first agency portal slice is available at `/agency` and is owned by the
agency domain module. Agency owners can view their fleet, add vehicles, edit
vehicle details, toggle availability, and delete vehicles. Agency profile
editing is exposed through the `updateAgency` Server Action.

All mutations use Zod schemas and verify the Supabase session, the `agency`
profile role, and ownership of the agency or vehicle on the server. The
database tables and columns are defined in
`MoroccoDrive/src/modules/agencies/schema.ts`.
