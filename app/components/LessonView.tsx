import { Lesson } from '@/app/actions/getLesson'
import React from 'react'

interface LessonProps {
  lesson: Lesson
}

export default function LessonView({ lesson }: LessonProps) {
  return (
    <div className='flex flex-col'>
      <p>{lesson.date}</p>
      <h2>{lesson.topic}</h2>
      <p>{lesson.description}</p>

      <h3>Resources</h3>
      <ul>
        {lesson.resources.map((resource, index) => (
          <li key={index}>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>

      <h3>Quiz</h3>
      {lesson.quiz.map((question, questionIndex) => (
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
