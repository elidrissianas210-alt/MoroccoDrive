import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnvironmentConfig } from "@/config/env";

let serviceRoleClient: SupabaseClient | undefined;

function getServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return value;
}

export function createAdminClient(): SupabaseClient {
  if (!serviceRoleClient) {
    const { supabaseUrl } = getPublicEnvironmentConfig();

    serviceRoleClient = createSupabaseClient(supabaseUrl, getServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serviceRoleClient;
}
