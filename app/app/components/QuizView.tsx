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
                <p className="text-lg">{!quizCompleted && `(${currentQuestionIndex + 1}/${quiz.length}) `}{currentQuestion.text}</p>
                <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.answers.map((answer, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAnswers[currentQuestionIndex] === index
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-gray-400'
                                }`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${selectedAnswers[currentQuestionIndex] === index
                                    ? 'border-blue-500'
                                    : 'border-gray-300'
                                    }`}>
                                    {selectedAnswers[currentQuestionIndex] === index && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    )}
                                </div>
                                <span>{answer.text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`px-4 py-2 rounded ${currentQuestionIndex === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNextQuestion}
                        disabled={!isAnswerSelected()}
                        className={`px-4 py-2 rounded ${!isAnswerSelected()
                            ? 'bg-blue-300 text-white cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const results = calculateResults();

        return (
            <div className="p-6 rounded-lg">
                <div className="mb-6">
                    <p className="text-lg font-semibold">
                        You scored {results.correct} out of {results.total} ({results.percentage}%)
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    {quiz.map((question, questionIndex) => {
                        const selectedAnswerIndex = selectedAnswers[questionIndex];
                        const selectedAnswerText = selectedAnswerIndex !== -1
                            ? question.answers[selectedAnswerIndex].text
                            : 'Not answered';
                        const isCorrect = selectedAnswerIndex !== -1 && question.answers[selectedAnswerIndex].is_correct;

                        return (
                            <div key={questionIndex} className="p-4 border rounded-lg">
                                <p className="font-medium">{question.text}</p>
                                <div className="mt-2 flex gap-2 items-center">
                                    <span className="text-sm font-semibold">Your answer:</span>
                                    <span className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedAnswerText}
                                    </span>
                                </div>
                                {!isCorrect && (
                                    <div className="mt-1 flex gap-2 items-center">
                                        <span className="text-sm font-semibold">Correct answer:</span>
                                        <span className="text-green-600">{getCorrectAnswerText(questionIndex)}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={restartQuiz}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    Restart Quiz
                </button>
            </div>
        );
    };

    return (
        <div className="">
            <h3>Quiz</h3>
            <div className='min-w-lg mx-auto p-4'>
                {!quizCompleted ? renderQuestion() : renderResults()}
            </div>
        </div>
    );
};
