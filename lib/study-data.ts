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

export async function loadCloudStudyData(
  supabase: SupabaseClient,
): Promise<StudyData> {
  const [{ data: subjects, error: subjectsError }, { data: exams, error: examsError }] =
    await Promise.all([
      supabase.from("subjects").select("id,name,created_at").order("created_at"),
      supabase
        .from("exams_deadlines")
        .select("id,title,subject,date,type,created_at")
        .order("date"),
    ]);

  if (subjectsError) throw subjectsError;
  if (examsError) throw examsError;

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id,subject_id,title,completed,created_at")
    .order("created_at");
  if (tasksError) throw tasksError;

  return {
    subjects: (subjects ?? []).map((subject) => ({
      id: subject.id,
      name: subject.name,
      tasks: (tasks ?? [])
        .filter((task) => task.subject_id === subject.id)
        .map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
        })),
    })),
    exams: (exams ?? []).map((exam) => ({
      id: exam.id,
      title: exam.title,
      subject: exam.subject,
      date: exam.date,
      type: exam.type as ExamDeadlineType,
    })),
  };
}

function cleanText(value: string, maxLength: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

async function getCurrentUserId(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Your session has expired. Please sign in again.");
  return data.user.id;
}

export async function insertSubject(supabase: SupabaseClient, name: string) {
  const cleanName = cleanText(name, 120);
  if (!cleanName) throw new Error("Subject name is required.");
  const userId = await getCurrentUserId(supabase);
  const { data, error } = await supabase
    .from("subjects")
    .insert({ user_id: userId, name: cleanName })
    .select("id,name")
    .single();
  if (error) throw error;
  return { id: data.id, name: data.name, tasks: [] };
}

export async function updateSubject(
  supabase: SupabaseClient,
  id: string,
  name: string,
) {
  const cleanName = cleanText(name, 120);
  if (!cleanName) throw new Error("Subject name is required.");
  const { error } = await supabase.from("subjects").update({ name: cleanName }).eq("id", id);
  if (error) throw error;
}

export async function deleteSubject(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) throw error;
}

export async function insertTask(
  supabase: SupabaseClient,
  subjectId: string,
  title: string,
) {
  const cleanTitle = cleanText(title, 240);
  if (!cleanTitle) throw new Error("Task title is required.");
  const userId = await getCurrentUserId(supabase);
  const { error } = await supabase.from("tasks").insert({
    user_id: userId,
    subject_id: subjectId,
    title: cleanTitle,
    completed: false,
  });
  if (error) throw error;
}

export async function updateTask(
  supabase: SupabaseClient,
  id: string,
  completed: boolean,
) {
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function insertExamDeadline(
  supabase: SupabaseClient,
  item: ExamDeadline,
) {
  const payload = {
    title: cleanText(item.title, 240),
    subject: cleanText(item.subject, 120),
    date: item.date,
    type: item.type,
  };
  if (!payload.title || !payload.subject || !/^\d{4}-\d{2}-\d{2}$/.test(payload.date) || !["exam", "deadline"].includes(payload.type)) {
    throw new Error("Title, subject and date are required.");
  }
  const userId = await getCurrentUserId(supabase);
  const { error } = await supabase.from("exams_deadlines").insert({ ...payload, user_id: userId });
  if (error) throw error;
}

export async function deleteExamDeadline(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("exams_deadlines").delete().eq("id", id);
  if (error) throw error;
}

export async function importLocalStudyData(
  supabase: SupabaseClient,
  localData: StudyData,
) {
  const subjects = [];
  for (const subject of localData.subjects) {
    const inserted = await insertSubject(supabase, subject.name);
    subjects.push({ source: subject, inserted });
    for (const task of subject.tasks) {
      await insertTask(supabase, inserted.id, task.title);
      if (task.completed) {
        const { data, error } = await supabase
          .from("tasks")
          .select("id")
          .eq("subject_id", inserted.id)
          .eq("title", cleanText(task.title, 240))
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (error) throw error;
        await updateTask(supabase, data.id, true);
      }
    }
  }
  for (const exam of localData.exams) await insertExamDeadline(supabase, exam);
}

export function clearLocalStudyData() {
  window.localStorage.removeItem(STORAGE_KEY);
}
import type { SupabaseClient } from "@supabase/supabase-js";
