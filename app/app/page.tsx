import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StudyApp } from "./study-app";

async function ProtectedApp() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app");

  return (
    <StudyApp
      user={{
        id: user.id,
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Student",
        email: user.email ?? "",
        avatar: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? "",
        signInAt: user.last_sign_in_at ?? "",
      }}
    />
  );
}

function AppLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] p-8 text-slate-700">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-10 w-72 rounded-xl bg-slate-200" />
        <div className="mt-8 h-48 rounded-3xl bg-white" />
      </div>
    </main>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<AppLoading />}>
      <ProtectedApp />
    </Suspense>
  );
}
