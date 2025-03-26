export interface Answer {
  text: string;
  is_correct: boolean;
}

export interface Question {
  text: string;
  answers: Answer[];
}

export interface Resource {
  title: string;
  link: string;
}

export interface Lesson {
  id: string;
  date: string;
  subject: string;
  topic: string;
  description: string;
  quiz: Question[];
  resources: Resource[];
}

export function lessonToJson(lesson: Lesson) {
  return {
    id: lesson.id,
    date: lesson.date,
    subject: lesson.subject,
    topic: lesson.topic,
    description: lesson.description,
    quiz: lesson.quiz.map((item) => ({
      text: item.text,
      answers: item.answers.map((answer) => ({
        text: answer.text,
        is_correct: answer.is_correct,
      })),
    })),
    resources: lesson.resources.map((item) => ({
      title: item.title,
      link: item.link,
    })),
  };
}
