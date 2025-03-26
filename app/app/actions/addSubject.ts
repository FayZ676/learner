"use server";

import { client } from "@/app/actions/supabaseClient";

export default async function addSubject(subject: string) {
  const { error } = await client.from("subjects").insert({ subject: subject });
  if (error) {
    throw new Error(error.message);
  }
}
