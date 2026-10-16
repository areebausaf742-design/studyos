import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const callbackError = url.searchParams.get("error_description") || url.searchParams.get("error");
  const next = url.searchParams.get("next") || "/app";

  if (callbackError) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "oauth");
    loginUrl.searchParams.set("error_description", callbackError.slice(0, 240));
    return NextResponse.redirect(loginUrl);
  }
  
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (error) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "callback");
    loginUrl.searchParams.set(
      "error_description",
      error.message.toLowerCase().includes("expired")
        ? "Your sign-in session expired. Please try again."
        : "Sign-in could not be completed. Please try again.",
    );
    return NextResponse.redirect(loginUrl);
  }

  // WORKAROUND: Allow the serverless runtime a moment to persist 
  // the session cookies before the redirect response flushes.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/app";
  return NextResponse.redirect(new URL(safeNext, url.origin));
}