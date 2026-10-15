import {
  ExamDeadline,
  formatDaysRemaining,
  formatExamDate,
  getDaysRemaining,
  getUrgencyLevel,
} from "@/lib/study-data";

type ExamDeadlineItemProps = {
  item: ExamDeadline;
  onDelete: (id: string) => void;
};

export function ExamDeadlineItem({ item, onDelete }: ExamDeadlineItemProps) {
  const daysRemaining = getDaysRemaining(item.date);
  const urgency = getUrgencyLevel(daysRemaining);
  const remainingLabel = formatDaysRemaining(daysRemaining);
  const formattedDate = formatExamDate(item.date);

  const urgencyBadgeStyles = {
    overdue: "bg-rose-50 text-rose-700 border-rose-200",
    today: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
    urgent: "bg-amber-50 text-amber-700 border-amber-200",
    normal: "bg-slate-100 text-slate-700 border-slate-200",
  }[urgency];

  const typeBadgeStyles =
    item.type === "exam"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${typeBadgeStyles}`}
        >
          {item.type}
        </span>
        <div>
          <h4 className="font-semibold text-slate-900 leading-tight">
            {item.title}
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            Subject:{" "}
            <span className="font-medium text-slate-700">{item.subject}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span>{formattedDate}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${urgencyBadgeStyles}`}
        >
          {remainingLabel}
        </span>
        <button
          aria-label={`Delete ${item.title}`}
          className="rounded-lg p-1 text-sm text-slate-400 hover:text-rose-600 transition"
          onClick={() => onDelete(item.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
