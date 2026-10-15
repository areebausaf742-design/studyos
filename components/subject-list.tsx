import { FormEvent, useState } from "react";
import { Subject } from "@/lib/study-data";

type SubjectListProps = {
  subjects: Subject[];
  selectedId?: string;
  onSelectSubject: (id: string) => void;
  onAddSubject: (name: string) => void;
};

export function SubjectList({
  subjects,
  selectedId,
  onSelectSubject,
  onAddSubject,
}: SubjectListProps) {
  const [newSubjectName, setNewSubjectName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newSubjectName.trim();
    if (!name) return;
    onAddSubject(name);
    setNewSubjectName("");
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Subjects</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          {subjects.length}
        </span>
      </div>

      <div className="space-y-1">
        {subjects.map((subject) => (
          <button
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
              subject.id === selectedId
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            type="button"
          >
            <span className="truncate">{subject.name}</span>
            <span className="ml-3 text-xs text-slate-400">
              {subject.tasks.length}
            </span>
          </button>
        ))}
        {subjects.length === 0 && (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
            Add your first subject below.
          </p>
        )}
      </div>

      <form className="mt-5 flex gap-2" onSubmit={handleSubmit}>
        <input
          aria-label="New subject name"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
          onChange={(event) => setNewSubjectName(event.target.value)}
          placeholder="New subject"
          value={newSubjectName}
        />
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          type="submit"
        >
          Add
        </button>
      </form>
    </aside>
  );
}
