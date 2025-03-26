"use server";

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

export default async function getLesson(
  date: string,
  subject: string
): Promise<Lesson | null> {
  "use cache";

  const { data, error } = await client
    .from("lessons")
    .select()
    .eq("date", date)
    .eq("subject", subject);
  if (error) {
    throw new Error(error.message);
  }
  if (data.length > 0) {
    const parsed = LessonSchema.safeParse(data[0]);
    if (parsed.success) {
      return parsed.data;
    } else {
      throw new Error(parsed.error.message);
    }
  }
  return null;
}
