export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Subject = {
  id: string;
  name: string;
  tasks: Task[];
};

export type ExamDeadlineType = "exam" | "deadline";

export type ExamDeadline = {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  type: ExamDeadlineType;
};

export type StudyData = {
  subjects: Subject[];
  exams: ExamDeadline[];
};

const STORAGE_KEY = "studyos-data";

export const emptyStudyData: StudyData = {
  subjects: [],
  exams: [],
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createSubject(name: string): Subject {
  return { id: createId(), name, tasks: [] };
}

export function createTask(title: string): Task {
  return { id: createId(), title, completed: false };
}

export function createExamDeadline(
  title: string,
  subject: string,
  date: string,
  type: ExamDeadlineType = "exam",
): ExamDeadline {
  return {
    id: createId(),
    title: title.trim(),
    subject: subject.trim(),
    date,
    type,
  };
}

export function getDaysRemaining(
  dateString: string,
  baseDate: Date = new Date(),
): number {
  if (!dateString) return 0;
  const parts = dateString.split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return 0;
  const [year, month, day] = parts;
  const target = new Date(year, month - 1, day);
  const today = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  );
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    const overdue = Math.abs(days);
    return overdue === 1 ? "1 day overdue" : `${overdue} days overdue`;
  }
  if (days === 0) {
    return "Due today";
  }
  if (days === 1) {
    return "Tomorrow (1 day left)";
  }
  return `${days} days left`;
}

export function formatExamDate(dateString: string): string {
  if (!dateString) return "";
  const parts = dateString.split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return dateString;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getUrgencyLevel(
  days: number,
): "overdue" | "today" | "urgent" | "normal" {
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "urgent";
  return "normal";
}

export function sortExamDeadlinesByDate(items: ExamDeadline[]): ExamDeadline[] {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.title.localeCompare(b.title);
  });
}

export function loadStudyData(): StudyData {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyStudyData;

    const parsed = JSON.parse(saved) as Partial<StudyData>;
    if (!parsed) return emptyStudyData;

    return {
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    };
  } catch (error) {
    console.error("Could not load StudyOS data.", error);
    return emptyStudyData;
  }
}

export function saveStudyData(data: StudyData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save StudyOS data.", error);
  }
}
