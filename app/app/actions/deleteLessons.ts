"use server";

import { revalidateTag } from "next/cache";

import { client } from "@/app/actions/supabaseClient";

export default async function deleteLessons(subject: string): Promise<void> {
  const { error } = await client
    .from("lessons")
    .delete()
    .eq("subject", subject);

    revalidateTag("subjectsCache")
    revalidateTag("lessonsCache")

  if (error) {
    throw new Error(error.message);
  }
}
