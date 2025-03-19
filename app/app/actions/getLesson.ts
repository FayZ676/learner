"use server"

import { z } from 'zod';

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
  date: z.string(),
  topic: z.string(),
  description: z.string(),
  quiz: z.array(QuestionSchema),
  resources: z.array(ResourceSchema),
});

interface Answer {
  text: string
  is_correct: boolean
}

interface Question {
  text: string
  answers: Answer[]
}

interface Resource {
  title: string
  link: string
}

export interface Lesson {
  date: string
  topic: string
  description: string
  quiz: Question[]
  resources: Resource[]
}

export default async function getLesson(): Promise<Lesson | null> {
  try {
    const response = await fetch(`${process.env.API_ENDPOINT}/lesson/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    const parsedLesson = LessonSchema.safeParse(data);

    if (parsedLesson.success) {
      return parsedLesson.data;
    } else {
      console.error('Invalid lesson structure:', parsedLesson.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}
