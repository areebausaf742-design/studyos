"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearLocalStudyData,
  emptyStudyData,
  insertExamDeadline,
  insertSubject,
  insertTask,
  deleteExamDeadline,
  deleteSubject,
  deleteTask,
  loadStudyData,
  loadCloudStudyData,
  updateSubject,
  updateTask,
  ExamDeadline,
  StudyData,
} from "@/lib/study-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Header } from "@/components/header";
import { SubjectList } from "@/components/subject-list";
import { TaskSection } from "@/components/task-section";
import { ExamDeadlineSection } from "@/components/exam-deadline-section";
import { HelloIntro } from "@/components/hello-intro";
import { ImportLocalData } from "@/components/import-local-data";
import { FocusTimer } from "@/components/focus-timer";
import { DatabaseSetup } from "@/components/database-setup";

type StudyUser = { id: string; name: string; email: string; avatar: string; signInAt: string };

export function StudyApp({ user }: { user: StudyUser }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [data, setData] = useState<StudyData>(emptyStudyData);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [databaseReady, setDatabaseReady] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    return loadCloudStudyData(supabase)
      .then((saved) => {
        setDatabaseReady(true);
        setData(saved);
        setSelectedId(saved.subjects[0]?.id);
        setLoading(false);
        const localData = loadStudyData();
        setShowImport(localData.subjects.length > 0 || localData.exams.length > 0);
        const introKey = `studyos-intro:${user.id}:${user.signInAt}`;
        if (!sessionStorage.getItem(introKey)) {
          sessionStorage.setItem(introKey, "shown");
          setShowIntro(true);
        }
      })
      .catch((loadError: Error) => {
        setDatabaseReady(false);
        setError(loadError.message || "Could not load your study plan.");
        setLoading(false);
      });
  }

  useEffect(() => {
    const kickoff = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(kickoff);
  // load intentionally follows the authenticated user identity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user.id, user.signInAt]);

  async function refresh() {
    setData(await loadCloudStudyData(supabase));
  }

  async function run(action: () => Promise<void>) {
    setError("");
    try {
      await action();
      await refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Something went wrong.");
    }
  }

  const selectedSubject = useMemo(
    () => data.subjects.find((subject) => subject.id === selectedId),
    [data.subjects, selectedId],
  );

  const allTasks = data.subjects.flatMap((subject) => subject.tasks);
  const completedTasks = allTasks.filter((task) => task.completed).length;
  const firstName = user.name.trim().split(/\s+/)[0] || "Student";

  if (loading) return <main className="min-h-screen bg-[#f6f7fb] p-8 text-slate-700"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-10 w-72 rounded-xl bg-slate-200" /><div className="mt-8 h-48 rounded-3xl bg-white" /></div></main>;

  return (
    <>
      {showIntro && <HelloIntro name={user.name} onDone={() => setShowIntro(false)} />}
      {showImport && (
        <ImportLocalData
          onCancel={() => setShowImport(false)}
          onImported={() => {
            clearLocalStudyData();
            setShowImport(false);
            void refresh();
          }}
          supabase={supabase}
        />
      )}
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">
          <Header user={user} onSignOut={() => void supabase.auth.signOut().then(() => {
            sessionStorage.removeItem(`studyos-intro:${user.id}`);
            router.push("/");
          })} />
          {error && (databaseReady ? <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : <DatabaseSetup onRetry={() => void load()} />)}
          <section className="mb-7 overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-950 p-6 text-white shadow-xl shadow-indigo-950/15 sm:p-9">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-indigo-100">Your study command center</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Hello, {firstName}.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">A clear next step beats a crowded plan. Pick one task, start a focus block, and keep moving.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-indigo-100">Today</p>
                <p className="mt-1 text-2xl font-semibold">{completedTasks}/{allTasks.length} tasks done</p>
              </div>
            </div>
          </section>
          <div className="mb-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Subjects</p><p className="mt-2 text-3xl font-semibold">{data.subjects.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Open tasks</p><p className="mt-2 text-3xl font-semibold">{allTasks.length - completedTasks}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Upcoming</p><p className="mt-2 text-3xl font-semibold">{data.exams.length}</p></div>
          </div>
          <div className="mb-7 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid flex-1 items-start gap-6 lg:grid-cols-[280px_1fr]">
            <SubjectList
              onAddSubject={(name) => void run(async () => {
                const created = await insertSubject(supabase, name);
                setSelectedId(created.id);
              })}
              onSelectSubject={setSelectedId}
              selectedId={selectedId}
              subjects={data.subjects}
            />
            <div className="space-y-6">
              <TaskSection
                key={selectedSubject?.id ?? "none"}
                onAddTask={(title) => selectedSubject && void run(() => insertTask(supabase, selectedSubject.id, title))}
                onDeleteSubject={() => selectedSubject && void run(() => deleteSubject(supabase, selectedSubject.id))}
                onDeleteTask={(id) => void run(() => deleteTask(supabase, id))}
                onRenameSubject={(name) => selectedSubject && void run(() => updateSubject(supabase, selectedSubject.id, name))}
                onToggleTask={(id) => {
                  const task = selectedSubject?.tasks.find((item) => item.id === id);
                  if (task) void run(() => updateTask(supabase, id, !task.completed));
                }}
                subject={selectedSubject}
              />
              <ExamDeadlineSection
                defaultSubjectName={selectedSubject?.name ?? ""}
                exams={data.exams}
                onAdd={(item: ExamDeadline) => void run(() => insertExamDeadline(supabase, item))}
                onDelete={(id) => void run(() => deleteExamDeadline(supabase, id))}
                subjects={data.subjects}
              />
            </div>
            </div>
            <FocusTimer />
          </div>
        </div>
      </main>
    </>
  );
}
