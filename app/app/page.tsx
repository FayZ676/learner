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
  const [subject, setSubject] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    async function fetchLesson() {
      subject && setLesson(await getLesson(getLocalDate(), subject))
    };

    if (subject) {
      fetchLesson();
    }
  }, [subject])

  function handleSelectSubject(selection: string) {
    setSubject(selection)
  }

  return (
    <div>
      <SubjectsView onSelect={handleSelectSubject} />
      {lesson && <LessonView lesson={lesson} />}
    </div>
  );
}
