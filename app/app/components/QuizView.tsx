import React, { useState } from "react";
import { Question } from "../types";
import QuizResults from "./QuizResults";
import QuizQuestion from "./QuizQuestion";


export default function QuizView({ quiz }: { quiz: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(quiz.length).fill(-1)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div>
        <h3>Quiz</h3>
        <p>No questions available for this lesson.</p>
      </div>
    );
  }

  const handleOptionSelect = (answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.length).fill(-1));
    setQuizCompleted(false);
  };

  function handleCompleteQuiz() {
    setQuizCompleted(!quizCompleted);
  }

  function handleUpdateCurrentQuestion(index: number) {
    setCurrentQuestionIndex(index);
  }

  return (
    <div>
      <h3>Quiz</h3>
      <div className="max-w-xl mx-auto">
        {!quizCompleted ? (
          <QuizQuestion
            question={quiz[currentQuestionIndex]}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onAnswerSelect={handleOptionSelect}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.length}
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            currentQuestionIndex={currentQuestionIndex}
            completeQuiz={handleCompleteQuiz}
            updateCurrentQuestion={handleUpdateCurrentQuestion}
          />
        ) : (
          <QuizResults
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            onRestartQuiz={restartQuiz}
          />
        )}
      </div>
    </div>
  );
}
