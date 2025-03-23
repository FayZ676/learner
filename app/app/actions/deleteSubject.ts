"use server";

import { revalidateTag } from 'next/cache'

export default async function deleteSubject(subject: string) {
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/subjects/delete?subject=${subject}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    revalidateTag('subjects')
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
}
