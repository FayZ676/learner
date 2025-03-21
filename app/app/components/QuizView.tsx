import React, { useState } from 'react';
import { Question } from '../types';

interface QuizViewProps {
    quiz: Question[]
}

export default function QuizComponent({ quiz }: QuizViewProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(quiz.length).fill(-1));
    const [quizCompleted, setQuizCompleted] = useState(false);

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

    const calculateResults = () => {
        let correctCount = 0;
        selectedAnswers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== -1 && quiz[questionIndex].answers[answerIndex].is_correct) {
                correctCount++;
            }
        });

        return {
            total: quiz.length,
            correct: correctCount,
            percentage: Math.round((correctCount / quiz.length) * 100)
        };
    };

    const getCorrectAnswerText = (questionIndex: number): string => {
        const correctAnswer = quiz[questionIndex].answers.find(answer => answer.is_correct);
        return correctAnswer ? correctAnswer.text : 'No correct answer found';
    };

    const isAnswerSelected = () => selectedAnswers[currentQuestionIndex] !== -1;

    const renderQuestion = () => {
        const currentQuestion = quiz[currentQuestionIndex];
        return (
            <div className="flex flex-col gap-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            {!quizCompleted && `Question ${currentQuestionIndex + 1} of ${quiz.length}`}
                        </h2>
                        <p className="text-lg">{currentQuestion.text}</p>
                        <div className="form-control flex flex-col gap-4">
                            {currentQuestion.answers.map((answer, index) => (
                                <label key={index} className="label cursor-pointer justify-start">
                                    <input
                                        type="radio"
                                        name="current-answer"
                                        className="radio radio-primary"
                                        checked={selectedAnswers[currentQuestionIndex] === index}
                                        onChange={() => handleOptionSelect(index)}
                                    />
                                    <span className="label-text ml-2 whitespace-normal">{answer.text}</span>
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
                                disabled={!isAnswerSelected()}
                                className="btn btn-primary"
                            >
                                {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const results = calculateResults();
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Quiz Results</h2>
                    <div className="mb-6">
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-value text-primary">{results.percentage}%</div>
                                <div className="stat-desc">{results.correct} out of {results.total} correct</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {quiz.map((question, questionIndex) => {
                            const selectedAnswerIndex = selectedAnswers[questionIndex];
                            const selectedAnswerText = selectedAnswerIndex !== -1
                                ? question.answers[selectedAnswerIndex].text
                                : 'Not answered';
                            const isCorrect = selectedAnswerIndex !== -1 && question.answers[selectedAnswerIndex].is_correct;
                            return (
                                <div key={questionIndex} className="collapse collapse-plus bg-base-200">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-medium flex justify-between">
                                        Question {questionIndex + 1}
                                        <span className={`badge ml-2 ${isCorrect ? 'badge-success' : 'badge-error'}`}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                    <div className="collapse-content">
                                        <p className="font-medium">{question.text}</p>
                                        <div className="mt-2 flex gap-2 items-center">
                                            <span className="text-sm font-semibold">Your answer:</span>
                                            <span className={`${isCorrect ? 'text-success' : 'text-error'}`}>
                                                {selectedAnswerText}
                                            </span>
                                        </div>
                                        {!isCorrect && (
                                            <div className="mt-1 flex gap-2 items-center">
                                                <span className="text-sm font-semibold">Correct answer:</span>
                                                <span className="text-success">{getCorrectAnswerText(questionIndex)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="card-actions justify-center">
                        <button
                            onClick={restartQuiz}
                            className="btn btn-primary"
                        >
                            Restart Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="">
            <h3 className="">Quiz</h3>
            <div className="max-w-lg mx-auto">
                {!quizCompleted ? renderQuestion() : renderResults()}
            </div>
        </div>
    );
};