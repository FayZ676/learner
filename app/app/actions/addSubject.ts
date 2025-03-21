"use server"

export default async function addSubject(subject: string) {
    try {
        const response = await fetch(`${process.env.API_ENDPOINT}/subjects/add?subject=${subject}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
}