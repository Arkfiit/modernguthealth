import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function supabaseServer() {
  let url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("YOUR_PROJECT_REF")) {
    url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  }

  // Use anon by default (respects RLS). Service role is optional and must stay server-only.
  let key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!key || key === "YOUR_ANON_KEY") {
    key = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

