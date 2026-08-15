import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnvironmentConfig } from "@/config/env";

let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getPublicEnvironmentConfig();

    browserClient = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
    );
  }

  return browserClient;
}
