"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createSubject,
  createTask,
  emptyStudyData,
  loadStudyData,
  saveStudyData,
  Task,
  StudyData,
} from "@/lib/study-data";

export default function Home() {
  const [data, setData] = useState<StudyData>(emptyStudyData);
  const [selectedId, setSelectedId] = useState<string>();
  const [subjectName, setSubjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [editingSubject, setEditingSubject] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = loadStudyData();
      setData(saved);
      setSelectedId(saved.subjects[0]?.id);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (hydrated) saveStudyData(data);
  }, [data, hydrated]);

  const selectedSubject = useMemo(
    () => data.subjects.find((subject) => subject.id === selectedId),
    [data.subjects, selectedId],
  );

  function addSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = subjectName.trim();
    if (!name) return;

    const subject = createSubject(name);
    setData((current) => ({ subjects: [...current.subjects, subject] }));
    setSelectedId(subject.id);
    setSubjectName("");
  }

  function renameSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = subjectName.trim();
    if (!name || !selectedId) return;

    setData((current) => ({
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId ? { ...subject, name } : subject,
      ),
    }));
    setSubjectName("");
    setEditingSubject(false);
  }

  function deleteSubject() {
    if (!selectedSubject || !window.confirm(`Delete ${selectedSubject.name}?`)) {
      return;
    }

    const remaining = data.subjects.filter(
      (subject) => subject.id !== selectedSubject.id,
    );
    setData({ subjects: remaining });
    setSelectedId(remaining[0]?.id);
    setEditingSubject(false);
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title || !selectedId) return;

    setData((current) => ({
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId
          ? { ...subject, tasks: [...subject.tasks, createTask(title)] }
          : subject,
      ),
    }));
    setTaskTitle("");
  }

  function updateTask(
    taskId: string,
    update: (task: Task) => Task | null,
  ) {
    if (!selectedId) return;

    setData((current) => ({
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId
          ? {
              ...subject,
              tasks: subject.tasks.reduce<Task[]>((tasks, task) => {
                if (task.id !== taskId) return [...tasks, task];
                const updatedTask = update(task);
                return updatedTask ? [...tasks, updatedTask] : tasks;
              }, []),
            }
          : subject,
      ),
    }));
  }

  const completedCount =
    selectedSubject?.tasks.filter((task) => task.completed).length ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            StudyOS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Keep your study plan moving.
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">
            Organize your subjects and focus on the next task.
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Subjects</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                {data.subjects.length}
              </span>
            </div>

            <div className="space-y-1">
              {data.subjects.map((subject) => (
                <button
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    subject.id === selectedId
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  key={subject.id}
                  onClick={() => {
                    setSelectedId(subject.id);
                    setEditingSubject(false);
                  }}
                  type="button"
                >
                  <span className="truncate">{subject.name}</span>
                  <span className="ml-3 text-xs text-slate-400">
                    {subject.tasks.length}
                  </span>
                </button>
              ))}
              {data.subjects.length === 0 && (
                <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
                  Add your first subject below.
                </p>
              )}
            </div>

            <form className="mt-5 flex gap-2" onSubmit={addSubject}>
              <input
                aria-label="New subject name"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
                onChange={(event) => setSubjectName(event.target.value)}
                placeholder="New subject"
                value={editingSubject ? "" : subjectName}
              />
              <button
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                type="submit"
              >
                Add
              </button>
            </form>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {selectedSubject ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    {editingSubject ? (
                      <form className="flex gap-2" onSubmit={renameSubject}>
                        <input
                          aria-label="Rename subject"
                          autoFocus
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xl font-bold outline-none ring-indigo-500 focus:ring-2"
                          onChange={(event) =>
                            setSubjectName(event.target.value)
                          }
                          value={subjectName}
                        />
                        <button
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                          type="submit"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <h2 className="text-2xl font-bold">{selectedSubject.name}</h2>
                    )}
                    <p className="mt-1 text-sm text-slate-500">
                      {completedCount} of {selectedSubject.tasks.length} tasks
                      complete
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      onClick={() => {
                        setSubjectName(selectedSubject.name);
                        setEditingSubject(true);
                      }}
                      type="button"
                    >
                      Rename
                    </button>
                    <button
                      className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      onClick={deleteSubject}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <form className="mt-6 flex gap-3" onSubmit={addTask}>
                  <input
                    aria-label="New task"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="What needs to be done?"
                    value={taskTitle}
                  />
                  <button
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                    type="submit"
                  >
                    Add task
                  </button>
                </form>

                <div className="mt-6 space-y-2">
                  {selectedSubject.tasks.map((task) => (
                    <div
                      className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                      key={task.id}
                    >
                      <input
                        aria-label={`Mark ${task.title} done`}
                        checked={task.completed}
                        className="size-4 accent-indigo-600"
                        onChange={() =>
                          updateTask(task.id, (current) => ({
                            ...current,
                            completed: !current.completed,
                          }))
                        }
                        type="checkbox"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          task.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {task.title}
                      </span>
                      <button
                        aria-label={`Delete ${task.title}`}
                        className="text-sm text-slate-400 hover:text-rose-600"
                        onClick={() =>
                          updateTask(task.id, () => null)
                        }
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {selectedSubject.tasks.length === 0 && (
                    <p className="py-10 text-center text-sm text-slate-500">
                      No tasks yet. Add one to get started.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex min-h-80 items-center justify-center text-center">
                <div>
                  <h2 className="text-xl font-semibold">Start with a subject</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Add a subject to create your first study task.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
