import { Check, X } from "lucide-react";
import { Question } from "../types";

interface QuizResultsProps {
  quiz: Question[];
  selectedAnswers: number[];
  onRestartQuiz: () => void;
}

export default function QuizResults({
  quiz,
  selectedAnswers,
  onRestartQuiz,
}: QuizResultsProps) {
  const calculateResults = () => {
    let correctCount = 0;
    selectedAnswers.forEach((answerIndex, questionIndex) => {
      if (
        answerIndex !== -1 &&
        quiz[questionIndex].answers[answerIndex].is_correct
      ) {
        correctCount++;
      }
    });

    return {
      total: quiz.length,
      correct: correctCount,
      percentage: Math.round((correctCount / quiz.length) * 100),
    };
  };

  const getCorrectAnswerText = (questionIndex: number): string => {
    const correctAnswer = quiz[questionIndex].answers.find(
      (answer) => answer.is_correct
    );
    return correctAnswer ? correctAnswer.text : "No correct answer found";
  };

  const results = calculateResults();

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="bg-base-100 mb-6 stats shadow">
          <div className="stat">
            <div className="stat-value text-primary">{results.percentage}%</div>
            <div className="stat-desc">
              {results.correct} out of {results.total} correct
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {quiz.map((question, questionIndex) => {
            const selectedAnswerIndex = selectedAnswers[questionIndex];
            const selectedAnswerText =
              selectedAnswerIndex !== -1
                ? question.answers[selectedAnswerIndex].text
                : "Not answered";
            const isCorrect =
              selectedAnswerIndex !== -1 &&
              question.answers[selectedAnswerIndex].is_correct;
            return (
              <div
                key={questionIndex}
                className="collapse collapse-plus bg-base-100"
              >
                <input type="checkbox" />
                <div className="collapse-title font-medium flex justify-between">
                  Question {questionIndex + 1}
                  <span
                    className={`badge ml-2 ${
                      isCorrect ? "badge-success" : "badge-error"
                    }`}
                  >
                    {isCorrect ? <Check /> : <X />}
                  </span>
                </div>
                <div className="collapse-content">
                  <p className="font-medium">{question.text}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span className="text-sm font-semibold">Your answer:</span>
                    <span
                      className={`${isCorrect ? "text-success" : "text-error"}`}
                    >
                      {selectedAnswerText}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="mt-1 flex gap-2 items-center">
                      <span className="text-sm font-semibold">
                        Correct answer:
                      </span>
                      <span className="text-success">
                        {getCorrectAnswerText(questionIndex)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="card-actions ml-auto">
          <button onClick={onRestartQuiz} className="btn btn-primary">
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
