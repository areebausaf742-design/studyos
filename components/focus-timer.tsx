"use client";

import { useEffect, useState } from "react";

const DEFAULT_SECONDS = 25 * 60;

export function FocusTimer() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  const progress = ((DEFAULT_SECONDS - seconds) / DEFAULT_SECONDS) * 100;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
      <div className="absolute -right-16 -top-20 size-48 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Focus room</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">One calm block</h2>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">25 min</span>
        </div>
        <div className="mt-8 flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-6xl font-medium tracking-[-0.08em] sm:text-7xl">{minutes}:{remainder}</p>
            <p className="mt-2 text-sm text-slate-400">{seconds === 0 ? "Session complete. Nice work." : running ? "Stay with the task in front of you." : "Ready when you are."}</p>
          </div>
          <button
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
            onClick={() => setRunning((value) => !value)}
            type="button"
          >
            {seconds === 0 ? "Restart" : running ? "Pause" : "Start"}
          </button>
        </div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-indigo-300 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
