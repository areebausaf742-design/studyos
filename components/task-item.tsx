import { Task } from "@/lib/study-data";

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
      <input
        aria-label={`Mark ${task.title} done`}
        checked={task.completed}
        className="size-4 accent-indigo-600"
        onChange={() => onToggle(task.id)}
        type="checkbox"
      />
      <span
        className={`flex-1 text-sm ${
          task.completed ? "text-slate-400 line-through" : "text-slate-700"
        }`}
      >
        {task.title}
      </span>
      <button
        aria-label={`Delete ${task.title}`}
        className="text-sm text-slate-400 hover:text-rose-600"
        onClick={() => onDelete(task.id)}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
