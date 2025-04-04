"use server";

import { revalidateTag } from "next/cache";

import { client } from "@/app/actions/supabaseClient";

export default async function deleteSubject(subject: string) {
  const { error } = await client
    .from("subjects")
    .delete()
    .eq("subject", subject);

  revalidateTag("subjectsCache");
  revalidateTag("lessonsCache");

  if (error) {
    throw new Error(error.message);
  }
}
