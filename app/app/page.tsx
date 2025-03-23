"use client"

import { useEffect, useState } from "react";

import { Lesson } from "./types";

import getLesson from "./actions/getLesson";

import LessonView from "./components/LessonView";
import SubjectsView from "./components/SubjectsView";


function getLocalDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}


export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [subject, setSubject] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    async function fetchLesson() {
      setLesson(null)
      setLoading(true)
      if (subject) {
        setLesson(await getLesson(getLocalDate(), subject))
      }
      setLoading(false)
    };

    fetchLesson();
  }, [subject])

  function handleSelectSubject(selection: string) {
    setSubject(selection)
  }

  return (
    <div>
      <SubjectsView updateActiveSubject={handleSelectSubject} activeSubject={subject ? subject : ""} loadingLesson={loading} />
      {loading && <div className="flex gap-2"><span className="loading loading-dots loading-md"></span><p>Loading lesson</p></div>}
      {/* NOTE: We need to cache lesson here. The API has cold starts. That's why it takes a long time to display initially. */}
      <LessonView lesson={lesson} />
    </div>
  );
}
