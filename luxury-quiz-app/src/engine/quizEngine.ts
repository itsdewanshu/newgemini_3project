import { Question } from '../types/quizTypes';

export interface QuizSession {
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, string[]>; // questionId -> selected options
  reviewList: string[]; // questionIds marked for review
  status: 'idle' | 'in-progress' | 'completed';
  startTime: number;
  endTime?: number;
}

export interface QuizResult {
  score: number; // Percentage 0-100
  correctCount: number;
  incorrectCount: number;
  notAttemptedCount: number;
  totalQuestions: number;
}

export const createQuizSession = (questions: Question[]): QuizSession => {
  return {
    questionIds: questions.map(q => q.id),
    currentIndex: 0,
    answers: {},
    reviewList: [],
    status: 'in-progress',
    startTime: Date.now(),
  };
};

export const answerQuestion = (
  session: QuizSession,
  questionId: string,
  answer: string | string[]
): QuizSession => {
  const normalizedAnswer = Array.isArray(answer) ? answer : [answer];
  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: normalizedAnswer,
    },
  };
};

export const goNext = (session: QuizSession): QuizSession => {
  if (session.currentIndex >= session.questionIds.length - 1) {
    return session;
  }
  return {
    ...session,
    currentIndex: session.currentIndex + 1,
  };
};

export const goPrev = (session: QuizSession): QuizSession => {
  if (session.currentIndex <= 0) {
    return session;
  }
  return {
    ...session,
    currentIndex: session.currentIndex - 1,
  };
};

export const goToQuestion = (session: QuizSession, index: number): QuizSession => {
  if (index < 0 || index >= session.questionIds.length) {
    return session;
  }
  return {
    ...session,
    currentIndex: index,
  };
};

export const markForReview = (session: QuizSession, questionId: string): QuizSession => {
  const isMarked = session.reviewList.includes(questionId);
  const newReviewList = isMarked
    ? session.reviewList.filter(id => id !== questionId)
    : [...session.reviewList, questionId];
  
  return {
    ...session,
    reviewList: newReviewList,
  };
};

export const calculateScore = (session: QuizSession, questions: Question[]): QuizResult => {
  let correctCount = 0;
  let incorrectCount = 0;
  let notAttemptedCount = 0;

  questions.forEach(question => {
    const userAnswers = session.answers[question.id];
    
    if (!userAnswers || userAnswers.length === 0) {
      notAttemptedCount++;
      return;
    }

    // Compare arrays (order doesn't matter for multi-select usually, but let's sort to be safe)
    const correctAnswers = [...question.correctAnswers].sort();
    const sortedUserAnswers = [...userAnswers].sort();
    
    // Check if lengths match
    if (sortedUserAnswers.length !== correctAnswers.length) {
      incorrectCount++;
      return;
    }

    // Check if all user answers are in correct answers (strict equality after sort)
    const isCorrect = sortedUserAnswers.every((ans, index) => ans === correctAnswers[index]);
    
    if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    score,
    correctCount,
    incorrectCount,
    notAttemptedCount,
    totalQuestions
  };
};
