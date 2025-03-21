"use client"

import { useEffect, useState } from "react";

import getLesson from "./actions/getLesson";

import LessonView from "./components/LessonView";
import { Lesson } from "./types";


function getLocalDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}


export default function Home() {
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      setLesson(await getLesson(getLocalDate()))
    };
    fetchLesson();
  }, [])

  return (
    <div>
      {lesson && <LessonView lesson={lesson} />}
    </div>
  );
}
