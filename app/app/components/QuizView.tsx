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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quiz.length).fill(-1));
    setQuizCompleted(false);
  };

  return (
    <div>
      <h3>Quiz</h3>
      <div className="max-w-xl mx-auto">
        {!quizCompleted ? (
          <div className="flex flex-col gap-4">
            <QuizQuestion
              question={quiz[currentQuestionIndex]}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              onAnswerSelect={handleOptionSelect}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.length}
            />
            <div className="card-actions justify-between mt-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="btn btn-ghost"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="btn btn-primary"
              >
                {currentQuestionIndex === quiz.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          </div>
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
