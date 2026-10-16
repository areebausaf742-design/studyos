export function DatabaseSetup({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">One-time setup</p>
          <h2 className="mt-2 text-xl font-semibold">Connect your StudyOS database</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-900/75">
            Your Google account is connected, but the StudyOS tables have not been created in Supabase yet.
            Open Supabase SQL Editor, run <code className="rounded bg-amber-100 px-1.5 py-0.5">supabase/migrations/20261015000000_studyos_initial.sql</code>, then refresh.
          </p>
        </div>
        <button className="rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800" onClick={onRetry} type="button">
          Refresh connection
        </button>
      </div>
    </section>
  );
}
