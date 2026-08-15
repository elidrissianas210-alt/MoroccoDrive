export interface PublicEnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function requireEnvironmentVariable(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicEnvironmentConfig(): PublicEnvironmentConfig {
  const supabaseUrl = requireEnvironmentVariable(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );

  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
  }

  return {
    supabaseUrl,
    supabaseAnonKey: requireEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}
