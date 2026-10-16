"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient, getAppOrigin } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    if (!params.has("error")) return "";
    return params.get("error_description") || "Sign-in was cancelled or expired. Please try again.";
  });
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const next = new URLSearchParams(window.location.search).get("next") || "/app";
      const appOrigin = getAppOrigin();
      if (!appOrigin) {
        throw new Error(
          'Could not determine a safe app origin for OAuth redirects. Open the site using your machine\'s LAN IP on the phone (for example http://192.168.x.x:3000), or set NEXT_PUBLIC_APP_URL in .env.local to a reachable origin.'
        );
      }
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${appOrigin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (authError) throw authError;
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      throw new Error("OAuth provider did not return a sign-in URL.");
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "";
      if (message.includes("environment variables")) {
        setError("Supabase is not configured in this app. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to D:\\Projects\\studyos\\.env (or .env.local), then restart the dev server.");
      } else if (message.toLowerCase().includes("provider") && message.toLowerCase().includes("not enabled")) {
        setError("Google sign-in is disabled in Supabase. Open Supabase → Authentication → Providers → Google, enable it, save, then try again.");
      } else {
        setError("Google sign-in could not start. Check the Supabase Auth provider and redirect URL settings.");
      }
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="auth-back" href="/">← Back home</Link>
        <p className="eyebrow">StudyOS</p>
        <h1>Make space for what&apos;s next.</h1>
        <p className="auth-copy">Sign in to keep your subjects, tasks and deadlines in your private study plan.</p>
        <button aria-busy={busy} className="google-button" disabled={busy} onClick={() => void signIn()} type="button">{busy ? "Opening Google…" : "Continue with Google"}</button>
        <p className="auth-network-note">For phone testing, open the network address <strong>http://192.168.29.226:3000</strong>. Phone localhost points back to the phone.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <p className="privacy-note">We use Google only for your name, email and avatar. Your study data belongs to your account.</p>
        <div className="auth-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </main>
  );
}
