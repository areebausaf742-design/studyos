import { FormEvent, useMemo, useState } from "react";
import {
  createExamDeadline,
  ExamDeadline,
  ExamDeadlineType,
  sortExamDeadlinesByDate,
  Subject,
} from "@/lib/study-data";
import { ExamDeadlineItem } from "@/components/exam-deadline-item";

type ExamDeadlineSectionProps = {
  exams: ExamDeadline[];
  subjects: Subject[];
  defaultSubjectName?: string;
  onAdd: (item: ExamDeadline) => void;
  onDelete: (id: string) => void;
};

export function ExamDeadlineSection({
  exams,
  subjects,
  defaultSubjectName = "",
  onAdd,
  onDelete,
}: ExamDeadlineSectionProps) {
  const [type, setType] = useState<ExamDeadlineType>("exam");
  const [title, setTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectName);
  const [customSubject, setCustomSubject] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(subjects.length === 0);
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState<"all" | "exam" | "deadline">("all");

  const effectiveSubject = isCustomMode ? customSubject : selectedSubject;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedSubject = effectiveSubject.trim();
    if (!trimmedTitle || !trimmedSubject || !date) return;

    const newItem = createExamDeadline(
      trimmedTitle,
      trimmedSubject,
      date,
      type,
    );
    onAdd(newItem);

    // Reset form fields
    setTitle("");
    setDate("");
    if (isCustomMode && subjects.length > 0) {
      setCustomSubject("");
      setIsCustomMode(false);
    }
  }

  const sortedItems = useMemo(
    () => sortExamDeadlinesByDate(exams),
    [exams],
  );

  const filteredItems = useMemo(() => {
    if (filter === "all") return sortedItems;
    return sortedItems.filter((item) => item.type === filter);
  }, [sortedItems, filter]);

  const examCount = exams.filter((item) => item.type === "exam").length;
  const deadlineCount = exams.filter((item) => item.type === "deadline").length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Exams & Deadlines
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {exams.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Track upcoming exams, assignments, and due dates in order of urgency.
          </p>
        </div>

        {exams.length > 0 && (
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600">
            <button
              className={`rounded-lg px-2.5 py-1.5 transition ${
                filter === "all"
                  ? "bg-white font-semibold text-slate-900 shadow-xs"
                  : "hover:text-slate-900"
              }`}
              onClick={() => setFilter("all")}
              type="button"
            >
              All ({exams.length})
            </button>
            <button
              className={`rounded-lg px-2.5 py-1.5 transition ${
                filter === "exam"
                  ? "bg-white font-semibold text-indigo-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
              onClick={() => setFilter("exam")}
              type="button"
            >
              Exams ({examCount})
            </button>
            <button
              className={`rounded-lg px-2.5 py-1.5 transition ${
                filter === "deadline"
                  ? "bg-white font-semibold text-emerald-700 shadow-xs"
                  : "hover:text-slate-900"
              }`}
              onClick={() => setFilter("deadline")}
              type="button"
            >
              Deadlines ({deadlineCount})
            </button>
          </div>
        )}
      </div>

      {/* Add Exam or Deadline Form */}
      <form
        className="mt-6 rounded-xl border border-slate-100 bg-slate-50/75 p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Add New Item
          </span>

          {/* Type Selector: Exam vs Deadline */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium">
            <button
              className={`rounded-md px-3 py-1 transition ${
                type === "exam"
                  ? "bg-indigo-600 font-semibold text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setType("exam")}
              type="button"
            >
              Exam
            </button>
            <button
              className={`rounded-md px-3 py-1 transition ${
                type === "deadline"
                  ? "bg-indigo-600 font-semibold text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setType("deadline")}
              type="button"
            >
              Deadline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Title input */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Title
            </label>
            <input
              aria-label="Exam or deadline title"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "exam"
                  ? "e.g., Midterm Exam"
                  : "e.g., Essay Draft Submission"
              }
              required
              value={title}
            />
          </div>

          {/* Subject selector / input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600">
                Subject
              </label>
              {subjects.length > 0 && (
                <button
                  className="text-[11px] text-indigo-600 hover:underline"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  type="button"
                >
                  {isCustomMode ? "Pick from list" : "+ Type new"}
                </button>
              )}
            </div>

            {isCustomMode || subjects.length === 0 ? (
              <input
                aria-label="Subject name"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g., Mathematics"
                required
                value={customSubject}
              />
            ) : (
              <select
                aria-label="Select subject"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setIsCustomMode(true);
                  } else {
                    setSelectedSubject(e.target.value);
                  }
                }}
                required
                value={selectedSubject}
              >
                <option value="">Select subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Date
            </label>
            <input
              aria-label="Due date"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              onChange={(e) => setDate(e.target.value)}
              required
              type="date"
              value={date}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
            type="submit"
          >
            Add {type === "exam" ? "Exam" : "Deadline"}
          </button>
        </div>
      </form>

      {/* Sorted List of Exams and Deadlines */}
      <div className="mt-6 space-y-2.5">
        {filteredItems.map((item) => (
          <ExamDeadlineItem
            item={item}
            key={item.id}
            onDelete={onDelete}
          />
        ))}

        {filteredItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
            {exams.length === 0
              ? "No exams or deadlines scheduled yet. Add your upcoming exams or project deadlines above."
              : `No ${filter === "exam" ? "exams" : "deadlines"} found.`}
          </div>
        )}
      </div>
    </section>
  );
}
