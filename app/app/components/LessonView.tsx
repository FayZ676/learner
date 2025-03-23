import React from "react";

import { Lesson } from "../types";
import QuizView from "./QuizView";
import ResourceView from "./ResourceView";

interface LessonProps {
  lesson: Lesson | null;
}

export default function LessonView({ lesson }: LessonProps) {
  return (
    <div className="flex flex-col">
      {lesson && (
        <>
          <h2>{lesson.topic}</h2>
          <p>{lesson.description}</p>
        </>
      )}
      <h3>Resources</h3>
      {lesson ? (
        <div className="carousel carousel-center rounded-box space-x-4 p-4">
          {lesson.resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <ResourceView title={resource.title} link={resource.link} />
            </a>
          ))}
        </div>
      ) : (
        <p>Nothing to show here.</p>
      )}
      <QuizView quiz={lesson ? lesson.quiz : []} />
    </div>
  );
}
