// This file contains utility functions for quiz logic, such as shuffling questions or calculating scores.

export const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
    return Math.round((correctAnswers / totalQuestions) * 100);
};