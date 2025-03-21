"use server"

import { z } from "zod";

const SubjectsSchema = z.array(z.string());

export default async function getSubjects() {
    try {
        const response = await fetch(`${process.env.API_ENDPOINT}/subjects/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const parsedSubjects = SubjectsSchema.safeParse(data);

        if (parsedSubjects.success) {
            return parsedSubjects.data;
        } else {
            console.error('Invalid subjects structure:', parsedSubjects.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return null;
    }
}
