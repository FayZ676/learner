import { Suspense } from "react";

import getLessons from "./actions/getLessons";
import getSubjects from "./actions/getSubjects";

import LearningPage from "./components/LearningPage";

import Loading from "./loading";
import { headers } from "next/headers";

async function getDateFromHeaders(): Promise<string> {
  const headersList = await headers();
  const date = new Date(headersList.get("date") || new Date().toUTCString());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default async function Home() {
  let initialSubject = null;
  const initialSubjects = await getSubjects();
  let initialLesson = null;
  if (initialSubjects && initialSubjects.length > 0) {
    initialSubject = initialSubjects[0];
    const lessons = await getLessons(
      await getDateFromHeaders(),
      initialSubject
    );
    initialLesson = lessons ? lessons[0] : null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <LearningPage
        initialSubjects={initialSubjects}
        initialSubject={initialSubject}
        initialLesson={initialLesson}
      />
    </Suspense>
  );
}
