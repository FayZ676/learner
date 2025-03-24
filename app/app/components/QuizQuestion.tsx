import { Question } from "../types";

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  selectedAnswers: number[];
  quiz: Question[];
  completeQuiz: () => void;
  updateCurrentQuestion: (index: number) => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
  currentQuestionIndex,
  selectedAnswers,
  quiz,
  completeQuiz,
  updateCurrentQuestion,
}: QuizQuestionProps) {
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      updateCurrentQuestion(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      updateCurrentQuestion(currentQuestionIndex - 1);
    }
  };
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mt-0">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <p className="text-lg">{question.text}</p>
        <div className="form-control flex flex-col gap-4">
          {question.answers.map((answer, index) => (
            <label key={index} className="label cursor-pointer justify-start">
              <input
                type="radio"
                name="current-answer"
                className="radio radio-primary"
                checked={selectedAnswer === index}
                onChange={() => onAnswerSelect(index)}
              />
              <span className="label-text ml-2 whitespace-normal">
                {answer.text}
              </span>
            </label>
          ))}
        </div>
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
    </div>
  );
}
