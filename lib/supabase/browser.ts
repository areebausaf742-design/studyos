import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(url, key);
}

export function getAppOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  // Prefer the browser's origin when running in a browser (mobile/desktop clients).
  if (typeof window !== "undefined") {
    try {
      const winOrigin = window.location.origin;
      const host = new URL(winOrigin).hostname;
      // Reject hosts that are not reachable from mobiles such as 0.0.0.0
      if (host && host !== "0.0.0.0") return winOrigin;
    } catch {
      // Ignore and fall back to configured origin below
    }
  }

  // Fall back to an explicitly configured origin if present and valid.
  if (configuredOrigin) {
    try {
      const host = new URL(configuredOrigin).hostname;
      if (host && host !== "0.0.0.0") return configuredOrigin;
    } catch {
      // invalid configured origin - ignore
    }
  }

  return "";
}
