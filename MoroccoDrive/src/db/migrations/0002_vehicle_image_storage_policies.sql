-- Vehicle images remain in a private bucket. Access is granted only through
-- authenticated Storage requests and agency ownership checks.
CREATE POLICY "vehicle images authenticated read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'vehicle-images'
);

CREATE POLICY "vehicle images agency upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1
    FROM public.agencies AS agency
    INNER JOIN public.profiles AS profile ON profile.id = agency.owner_id
    WHERE profile.id = (SELECT auth.uid())
      AND profile.role = 'agency'
      AND agency.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "vehicle images agency delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-images'
  AND EXISTS (
    SELECT 1
    FROM public.car_images AS image
    INNER JOIN public.cars AS car ON car.id = image.car_id
    INNER JOIN public.agencies AS agency ON agency.id = car.agency_id
    INNER JOIN public.profiles AS profile ON profile.id = agency.owner_id
    WHERE image.storage_path = name
      AND profile.id = (SELECT auth.uid())
      AND profile.role = 'agency'
  )
);
