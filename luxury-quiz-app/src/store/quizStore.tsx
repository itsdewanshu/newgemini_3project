import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizSet } from '../types/quizTypes';
import { ThemeMode } from '../theme/themeConfig';

type QuizMode = 'PRACTICE' | 'TEST' | 'ZEN';

interface QuizContextType {
  activeQuizSet: QuizSet | null;
  activeMode: QuizMode | null;
  setActiveQuizSet: (quizSet: QuizSet, mode: QuizMode) => void;
  clearActiveQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeQuizSet, setActiveQuizSetState] = useState<QuizSet | null>(null);
  const [activeMode, setActiveModeState] = useState<QuizMode | null>(null);

  const setActiveQuizSet = (quizSet: QuizSet, mode: QuizMode) => {
    setActiveQuizSetState(quizSet);
    setActiveModeState(mode);
  };

  const clearActiveQuiz = () => {
    setActiveQuizSetState(null);
    setActiveModeState(null);
  };

  return (
    <QuizContext.Provider value={{ activeQuizSet, activeMode, setActiveQuizSet, clearActiveQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizStore = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizStore must be used within a QuizProvider');
  }
  return context;
};
