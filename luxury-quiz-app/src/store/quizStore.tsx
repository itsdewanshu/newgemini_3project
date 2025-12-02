import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizSet } from '../types/quizTypes';
import { ThemeMode } from '../theme/themeConfig';

type QuizMode = 'PRACTICE' | 'TEST' | 'ZEN' | 'CHALLENGER';

interface QuizContextType {
  activeQuizSet: QuizSet | null;
  activeMode: QuizMode | null;
  activeConfig: any | null;
  setActiveQuizSet: (quizSet: QuizSet, mode: QuizMode, config?: any) => void;
  clearActiveQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeQuizSet, setActiveQuizSetState] = useState<QuizSet | null>(null);
  const [activeMode, setActiveModeState] = useState<QuizMode | null>(null);
  const [activeConfig, setActiveConfigState] = useState<any | null>(null);

  const setActiveQuizSet = (quizSet: QuizSet, mode: QuizMode, config?: any) => {
    setActiveQuizSetState(quizSet);
    setActiveModeState(mode);
    setActiveConfigState(config || null);
  };

  const clearActiveQuiz = () => {
    setActiveQuizSetState(null);
    setActiveModeState(null);
    setActiveConfigState(null);
  };

  return (
    <QuizContext.Provider value={{ activeQuizSet, activeMode, activeConfig, setActiveQuizSet, clearActiveQuiz }}>
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
