"use client"

import { useEffect, useState } from "react";

import getLesson from "./actions/getLesson";
import LessonView from "./components/LessonView";
import { Lesson } from "./types";

export default function Home() {
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      setLesson(await getLesson())
    };
    fetchLesson();
  }, [])

  return (
    <div>
      {lesson && <LessonView lesson={lesson} />}
    </div>
  );
}
