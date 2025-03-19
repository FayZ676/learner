"use server"

interface Answer {
  text: string
  isCorrect: boolean
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
    const response = await fetch('http://localhost:8000/lesson/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    if (isValidLesson(data)) {
      return data;
    } else {
      throw new Error('Invalid lesson structure');
    }
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}

function isValidLesson(data: any): data is Lesson {
  return (
    typeof data.date === 'string' &&
    typeof data.topic === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.quiz) &&
    data.quiz.every((question: any) =>
      typeof question.text === 'string' &&
      Array.isArray(question.answers) &&
      question.answers.every((answer: any) =>
        typeof answer.text === 'string' &&
        typeof answer.is_correct === 'boolean'
      )
    ) &&
    Array.isArray(data.resources) &&
    data.resources.every((resource: any) =>
      typeof resource.title === 'string' &&
      typeof resource.link === 'string'
    )
  );
}
