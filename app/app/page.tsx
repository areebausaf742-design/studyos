"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createSubject,
  createTask,
  emptyStudyData,
  ExamDeadline,
  loadStudyData,
  saveStudyData,
  StudyData,
} from "@/lib/study-data";
import { Header } from "@/components/header";
import { SubjectList } from "@/components/subject-list";
import { TaskSection } from "@/components/task-section";
import { ExamDeadlineSection } from "@/components/exam-deadline-section";

export default function Home() {
  const [data, setData] = useState<StudyData>(emptyStudyData);
  const [selectedId, setSelectedId] = useState<string>();
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

  function handleAddSubject(name: string) {
    const subject = createSubject(name);
    setData((current) => ({
      ...current,
      subjects: [...current.subjects, subject],
    }));
    setSelectedId(subject.id);
  }

  function handleRenameSubject(newName: string) {
    if (!selectedId) return;
    setData((current) => ({
      ...current,
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId ? { ...subject, name: newName } : subject,
      ),
    }));
  }

  function handleDeleteSubject() {
    if (!selectedSubject || !window.confirm(`Delete ${selectedSubject.name}?`)) {
      return;
    }

    const remaining = data.subjects.filter(
      (subject) => subject.id !== selectedSubject.id,
    );
    setData((current) => ({ ...current, subjects: remaining }));
    setSelectedId(remaining[0]?.id);
  }

  function handleAddTask(title: string) {
    if (!selectedId) return;
    setData((current) => ({
      ...current,
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId
          ? { ...subject, tasks: [...subject.tasks, createTask(title)] }
          : subject,
      ),
    }));
  }

  function handleToggleTask(taskId: string) {
    if (!selectedId) return;
    setData((current) => ({
      ...current,
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId
          ? {
              ...subject,
              tasks: subject.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task,
              ),
            }
          : subject,
      ),
    }));
  }

  function handleDeleteTask(taskId: string) {
    if (!selectedId) return;
    setData((current) => ({
      ...current,
      subjects: current.subjects.map((subject) =>
        subject.id === selectedId
          ? {
              ...subject,
              tasks: subject.tasks.filter((task) => task.id !== taskId),
            }
          : subject,
      ),
    }));
  }

  function handleAddExamDeadline(item: ExamDeadline) {
    setData((current) => ({
      ...current,
      exams: [...(current.exams ?? []), item],
    }));
  }

  function handleDeleteExamDeadline(id: string) {
    setData((current) => ({
      ...current,
      exams: (current.exams ?? []).filter((item) => item.id !== id),
    }));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">
        <Header />

        <div className="grid flex-1 items-start gap-6 lg:grid-cols-[280px_1fr]">
          <SubjectList
            onAddSubject={handleAddSubject}
            onSelectSubject={setSelectedId}
            selectedId={selectedId}
            subjects={data.subjects}
          />

          <div className="space-y-6">
            <TaskSection
              key={selectedSubject?.id ?? "none"}
              onAddTask={handleAddTask}
              onDeleteSubject={handleDeleteSubject}
              onDeleteTask={handleDeleteTask}
              onRenameSubject={handleRenameSubject}
              onToggleTask={handleToggleTask}
              subject={selectedSubject}
            />

            <ExamDeadlineSection
              defaultSubjectName={selectedSubject?.name ?? ""}
              exams={data.exams ?? []}
              onAdd={handleAddExamDeadline}
              onDelete={handleDeleteExamDeadline}
              subjects={data.subjects}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
