import { createClient } from "@/lib/supabase/server";

const BUCKET = "vehicle-images";

export async function createVehicleImageSignedUrl(storagePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 3600);
  return error || !data?.signedUrl ? "" : data.signedUrl;
}

export async function uploadVehicleImage(storagePath: string, file: File) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file, { contentType: file.type, upsert: false });
  if (error) throw error;
}

export async function deleteVehicleImage(storagePath: string) {
  const supabase = await createClient();
  return supabase.storage.from(BUCKET).remove([storagePath]);
}
