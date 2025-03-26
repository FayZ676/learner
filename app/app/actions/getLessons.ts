"use server";

import { unstable_cacheTag as cacheTag } from "next/cache";

import { z } from "zod";

import { client } from "@/app/actions/supabaseClient";

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

export default async function getLessons(
  date: string,
  subject: string
): Promise<Lesson[] | null> {
  "use cache";
  cacheTag("lessonsCache");

  const { data, error } = await client
    .from("lessons")
    .select()
    .eq("date", date)
    .eq("subject", subject);
  if (error) {
    throw new Error(error.message);
  }
  if (data.length > 0) {
    return data
      .map((lesson) => {
        const parsed = LessonSchema.safeParse(lesson);
        if (parsed.success) {
          return parsed.data;
        } else {
          console.log(lesson)
          throw new Error(`Failed to parse lesson: ${parsed.error.errors}`);
        }
      })
      .filter((lesson) => lesson !== null);
  }
  return null;
}
