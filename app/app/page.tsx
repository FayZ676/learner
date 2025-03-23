"use client";

import { useEffect, useState } from "react";
import { Lesson } from "./types";
import getLesson from "./actions/getLesson";
import getSubjects from "./actions/getSubjects";
import LessonView from "./components/LessonView";
import SubjectsView from "./components/SubjectsView";

function getLocalDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      try {
        const fetchedSubjects = await getSubjects();
        if (fetchedSubjects && fetchedSubjects.length > 0) {
          setSubjects(fetchedSubjects);
          setActiveSubject(fetchedSubjects[0]);
          const fetchedLesson = await getLesson(
            getLocalDate(),
            fetchedSubjects[0]
          );
          setLesson(fetchedLesson);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
      setLoading(false);
    }

    initialize();
  }, []);

  useEffect(() => {
    async function fetchLessonForSubject() {
      if (!activeSubject || loading) return;
      setLoading(true);
      try {
        const fetchedLesson = await getLesson(getLocalDate(), activeSubject);
        setLesson(fetchedLesson);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
      setLoading(false);
    }

    fetchLessonForSubject();
  }, [activeSubject]);

  return (
    <div>
      <SubjectsView
        subjects={subjects}
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
        onSubjectsUpdate={setSubjects}
        loadingLesson={loading}
      />

      {loading && (
        <div className="flex gap-2 items-center my-4">
          <span className="loading loading-dots loading-md"></span>
          <p>Loading lesson</p>
        </div>
      )}

      {!loading && subjects.length === 0 && (
        <div className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>Please add a subject to get started.</p>
        </div>
      )}

      {!loading && subjects.length > 0 && <LessonView lesson={lesson} />}
    </div>
  );
}
