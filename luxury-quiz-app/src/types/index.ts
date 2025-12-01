export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  answerOptions: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Result {
  quizId: string;
  score: number;
  totalQuestions: number;
  date: Date;
}