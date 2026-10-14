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

export type StudyData = {
  subjects: Subject[];
};

const STORAGE_KEY = "studyos-data";

export const emptyStudyData: StudyData = { subjects: [] };

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createSubject(name: string): Subject {
  return { id: createId(), name, tasks: [] };
}

export function createTask(title: string): Task {
  return { id: createId(), title, completed: false };
}

export function loadStudyData(): StudyData {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyStudyData;

    const parsed = JSON.parse(saved) as StudyData;
    if (!parsed || !Array.isArray(parsed.subjects)) return emptyStudyData;

    return parsed;
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
