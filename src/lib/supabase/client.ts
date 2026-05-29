import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isAuthConfigured(): boolean {
  const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

export function getSupabaseClient(): SupabaseClient {
  if (!isAuthConfigured()) {
    throw new Error("Supabase is not configured");
  }
  if (!browserClient) {
    browserClient = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return browserClient;
}

export function getAuthCallbackUrl(): string {
  if (typeof window === "undefined") {
    return "/auth/callback/";
  }
  return new URL("/auth/callback/", window.location.origin).href;
}
