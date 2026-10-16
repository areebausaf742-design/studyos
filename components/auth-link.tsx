"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const [href, setHref] = useState("/login?next=/app");

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.getUser().then(({ data }) => {
        if (data.user) setHref("/app");
      });
    } catch {
      // Missing configuration keeps the safe signed-out destination.
    }
  }, []);

  return <a className={className} href={href}>{children}</a>;
}
