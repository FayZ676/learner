export interface Answer {
    text: string
    is_correct: boolean
}

export interface Question {
    text: string
    answers: Answer[]
}

export interface Resource {
    title: string
    link: string
}

export interface Lesson {
    id: string
    date: string
    subject: string
    topic: string
    description: string
    quiz: Question[]
    resources: Resource[]
}