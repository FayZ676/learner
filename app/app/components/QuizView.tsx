import React from 'react'
import { Question } from '../types'

interface QuizProps {
    quiz: Question[]
}

export default function QuizView({ quiz }: QuizProps) {
    return (
        <div>
            <h3>Quiz</h3>
            {quiz.map((question, questionIndex) => (
                <div key={questionIndex}>
                    <p>{question.text}</p>
                    <ul>
                        {question.answers.map((answer, answerIndex) => (
                            <li key={answerIndex}>
                                <label>
                                    <input type="checkbox" disabled />
                                    {answer.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
