"use server";

import { revalidateTag } from "next/cache";

import { Lesson, lessonToJson } from "../types";

import { client } from "@/app/actions/supabaseClient";

export default async function addLesson(lesson: Lesson) {
  const { error } = await client.from("lessons").insert(lessonToJson(lesson));

  revalidateTag("subjectsCache");
  revalidateTag("lessonsCache");

  if (error) {
    throw new Error(error.message);
  }
}
