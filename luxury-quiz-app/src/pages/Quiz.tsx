import React from 'react';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import { useQuiz } from '../hooks/useQuiz';

const Quiz: React.FC = () => {
    const {
        currentQuestionIndex,
        questions,
        score,
        selectAnswer,
        totalQuestions,
    } = useQuiz();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <h1 className="text-4xl font-bold text-white mb-4">Luxury Quiz</h1>
            <ProgressBar currentQuestionIndex={currentQuestionIndex} totalQuestions={totalQuestions} />
            {questions.length > 0 && (
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    onAnswerSelected={selectAnswer}
                />
            )}
            <div className="mt-4 text-white">
                <p>Your Score: {score}</p>
            </div>
        </div>
    );
};

export default Quiz;