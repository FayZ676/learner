import { Suspense } from "react";

import getLesson from "./actions/getLesson";
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
  if (initialSubjects) {
    initialSubject = initialSubjects[0];
    initialLesson = await getLesson(await getDateFromHeaders(), initialSubject);
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
