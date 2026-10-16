"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { importLocalStudyData, loadStudyData } from "@/lib/study-data";

export function ImportLocalData({
  supabase,
  onImported,
  onCancel,
}: {
  supabase: SupabaseClient;
  onImported: () => void;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleImport() {
    setBusy(true);
    setError("");
    try {
      await importLocalStudyData(supabase, loadStudyData());
      onImported();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed. Your local data is still safe.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-5" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div className="max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900" id="import-title">Import your local study plan?</h2>
        <p className="mt-2 text-sm text-slate-600">Copy your existing subjects, tasks and exams to your account. Local data is cleared only after every item imports successfully.</p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm" onClick={onCancel} type="button">Not now</button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} onClick={() => void handleImport()} type="button">{busy ? "Importing…" : "Import my local data"}</button>
        </div>
      </div>
    </div>
  );
}
