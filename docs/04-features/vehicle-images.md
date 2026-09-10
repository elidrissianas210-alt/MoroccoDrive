# Vehicle Image Management

Vehicles support multiple images through the `car_images` table. Image bytes
are uploaded to the Supabase Storage `vehicle-images` bucket; PostgreSQL stores
only the storage path, public URL, vehicle relation, and display order.

Upload and delete actions validate file type and size and verify the vehicle is
owned by the authenticated agency before accessing Storage or the database.
The initial limits are JPG, PNG, or WebP images up to 5 MB, with at most 10
files per upload request.
