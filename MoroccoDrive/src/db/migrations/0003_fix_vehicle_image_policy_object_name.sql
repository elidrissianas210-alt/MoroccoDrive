DROP POLICY IF EXISTS "vehicle images agency upload" ON storage.objects;
DROP POLICY IF EXISTS "vehicle images agency delete" ON storage.objects;

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
      AND agency.id::text = (storage.foldername(storage.objects.name))[1]
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
    WHERE image.storage_path = storage.objects.name
      AND profile.id = (SELECT auth.uid())
      AND profile.role = 'agency'
  )
);
