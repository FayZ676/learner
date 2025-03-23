"use server";

import { z } from "zod";
import { Lesson } from "../types";

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
  date: z.string(),
  topic: z.string(),
  description: z.string(),
  quiz: z.array(QuestionSchema),
  resources: z.array(ResourceSchema),
});

export default async function getLesson(
  date: string,
  subject: string
): Promise<Lesson | null> {
  "use cache"
  
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/lesson/get?date=${date}&subject=${subject}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    const parsedLesson = LessonSchema.safeParse(data);

    if (parsedLesson.success) {
      return parsedLesson.data;
    } else {
      console.error("Invalid lesson structure:", parsedLesson.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}
