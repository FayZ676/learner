"use server";

import { z } from "zod";

import { client } from "@/app/actions/supabaseClient";

const SubjectsSchema = z.array(z.string());

export default async function getSubjects() {
  "use cache";

  const { data, error } = await client.from("subjects").select();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  const parsed = SubjectsSchema.safeParse(data.map(subject => subject.subject));
  if (parsed.success) {
    return parsed.data;
  } else {
    throw new Error(parsed.error.message);
  }
}
