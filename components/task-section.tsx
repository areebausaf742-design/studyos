import { FormEvent, useState } from "react";
import { Subject } from "@/lib/study-data";
import { TaskItem } from "@/components/task-item";

type TaskSectionProps = {
  subject?: Subject;
  onRenameSubject: (newName: string) => void;
  onDeleteSubject: () => void;
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TaskSection({
  subject,
  onRenameSubject,
  onDeleteSubject,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [taskTitle, setTaskTitle] = useState("");


  if (!subject) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex min-h-80 items-center justify-center text-center">
          <div>
            <h2 className="text-xl font-semibold">Start with a subject</h2>
            <p className="mt-2 text-sm text-slate-500">
              Add a subject to create your first study task.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const completedCount = subject.tasks.filter((task) => task.completed).length;

  function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    onRenameSubject(trimmed);
    setIsEditing(false);
  }

  function handleAddTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = taskTitle.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setTaskTitle("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          {isEditing ? (
            <form className="flex gap-2" onSubmit={handleRenameSubmit}>
              <input
                aria-label="Rename subject"
                autoFocus
                className="rounded-lg border border-slate-200 px-3 py-2 text-xl font-bold outline-none ring-indigo-500 focus:ring-2"
                onChange={(event) => setRenameValue(event.target.value)}
                value={renameValue}
              />
              <button
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                type="submit"
              >
                Save
              </button>
            </form>
          ) : (
            <h2 className="text-2xl font-bold">{subject.name}</h2>
          )}
          <p className="mt-1 text-sm text-slate-500">
            {completedCount} of {subject.tasks.length} tasks complete
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => {
              setRenameValue(subject.name);
              setIsEditing(true);
            }}
            type="button"
          >
            Rename
          </button>
          <button
            className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            onClick={onDeleteSubject}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      <form className="mt-6 flex gap-3" onSubmit={handleAddTaskSubmit}>
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
        {subject.tasks.map((task) => (
          <TaskItem
            key={task.id}
            onDelete={onDeleteTask}
            onToggle={onToggleTask}
            task={task}
          />
        ))}
        {subject.tasks.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            No tasks yet. Add one to get started.
          </p>
        )}
      </div>
    </section>
  );
}
