# Vehicle Image Storage Policies

The `vehicle-images` bucket remains private. Storage RLS permits authenticated
users to read objects, permits uploads only when the first storage path segment
matches an agency owned by the authenticated agency profile, and permits
deletes only when the object path exists in `car_images` and resolves through
`cars.agency_id` to that same agency owner.

The policies are applied by migrations `0002_vehicle_image_storage_policies`
and `0003_fix_vehicle_image_policy_object_name`. Vehicle image reads use
short-lived signed URLs because `getPublicUrl` is not appropriate for a
private bucket.
