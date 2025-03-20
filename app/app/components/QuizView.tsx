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
                    <ul className='list-none pl-0'>
                        {question.answers.map((answer, answerIndex) => (
                            <li key={answerIndex}>
                                <input type="checkbox" className='checkbox mr-2' />
                                {answer.text}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
