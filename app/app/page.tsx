"use client"

import { useEffect, useState } from "react";

import getLesson from "./actions/getLesson";
import LessonView from "./components/LessonView";
import { Lesson } from "./types";

export default function Home() {
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      const dateString = new Date().toISOString().slice(0, 10)
      setLesson(await getLesson(dateString))
    };
    fetchLesson();
  }, [])

  return (
    <div>
      {lesson && <LessonView lesson={lesson} />}
    </div>
  );
}
