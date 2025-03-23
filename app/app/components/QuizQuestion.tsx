import { Question } from "../types";

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
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
      </div>
    </div>
  );
}
