import { useState, useEffect } from 'react';
import { Question } from '../types';

const useQuiz = (questions: Question[]) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const totalQuestions = questions.length;

    const selectAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setIsQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizFinished(false);
    };

    useEffect(() => {
        if (isQuizFinished) {
            // Handle quiz finish logic, e.g., save results to IndexedDB
        }
    }, [isQuizFinished]);

    return {
        currentQuestionIndex,
        score,
        isQuizFinished,
        totalQuestions,
        selectAnswer,
        restartQuiz,
    };
};

export default useQuiz;