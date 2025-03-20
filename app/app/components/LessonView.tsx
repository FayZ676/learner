import React from 'react'

import { Lesson } from '../types'
import QuizView from './QuizView'

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
      
      <QuizView quiz={lesson.quiz} />
    </div>
  )
}
