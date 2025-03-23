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
  // In page.tsx:
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);
  const [loadingLesson, setLoadingLesson] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function initialize() {
      setLoadingSubjects(true);
      try {
        const fetchedSubjects = await getSubjects();
        if (fetchedSubjects && fetchedSubjects.length > 0) {
          setSubjects(fetchedSubjects);
          setActiveSubject(fetchedSubjects[0]);
          setLoadingLesson(true);
          const fetchedLesson = await getLesson(
            getLocalDate(),
            fetchedSubjects[0]
          );
          setLesson(fetchedLesson);
          setLoadingLesson(false);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
      setLoadingSubjects(false);
    }

    initialize();
  }, []);

  useEffect(() => {
    async function fetchLessonForSubject() {
      if (!activeSubject || loadingSubjects) return;
      setLoadingLesson(true);
      try {
        const fetchedLesson = await getLesson(getLocalDate(), activeSubject);
        setLesson(fetchedLesson);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
      setLoadingLesson(false);
    }

    fetchLessonForSubject();
  }, [activeSubject, loadingSubjects]);

  return (
    <div>
      <SubjectsView
        subjects={subjects}
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
        onSubjectsUpdate={setSubjects}
        controlsDisabled={loadingSubjects || loadingLesson}
      />

      {loadingLesson && (
        <div className="flex gap-2 items-center my-4">
          <span className="loading loading-dots loading-md"></span>
          <p>Loading lesson</p>
        </div>
      )}

      {!loadingLesson && (
        <div>
          <p>Please add a subject to get started.</p>
        </div>
      )}

      {!loadingLesson && <LessonView lesson={lesson} />}
    </div>
  );
}
