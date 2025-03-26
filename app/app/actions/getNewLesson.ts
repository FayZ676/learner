"use server";

import { z } from "zod";

import { Lesson } from "../types";

interface getNewLessonProps {
  date: string;
  subject: string;
  previousSubjects: string[];
}

const AnswerSchema = z.object({
  text: z.string(),
  is_correct: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string(),
  answers: z.array(AnswerSchema),
});

const ResourceSchema = z.object({
  title: z.string(),
  link: z.string(),
});

const LessonSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  description: z.string(),
  quiz: z.array(QuestionSchema),
  resources: z.array(ResourceSchema),
});

export default async function getNewLesson({
  date,
  subject,
  previousSubjects,
}: getNewLessonProps): Promise<Lesson> {
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/lesson/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          previousSubjects,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Retrieved bad response from API: (${response.status}) ${response.text}`
      );
    }
    const data = await response.json();
    const parsed = LessonSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Retrieved bad lesson from API.");
    }
    const parsedData = parsed.data;
    return {
      ...parsedData,
      date,
    };
  } catch {
    throw new Error("Unable to retrieve new lesson from API.");
  }
}
