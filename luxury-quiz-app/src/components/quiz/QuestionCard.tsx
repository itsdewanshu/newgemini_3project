import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../../types/quizTypes';
import { useCurrentTheme } from '../../hooks/useCurrentTheme';

interface QuestionCardProps {
  question: Question;
  currentAnswer?: string; // Currently supporting single choice for simplicity in UI
  onAnswer: (option: string) => void;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  currentAnswer, 
  onAnswer,
  disabled = false
}) => {
  const { theme } = useCurrentTheme();

  return (
    <div className="flex-1 flex flex-col justify-center mb-8 w-full">
      <h3 className={`text-xl md:text-2xl font-medium leading-relaxed mb-8 ${theme.colors.text.primary}`}>
        {question.questionText}
      </h3>

      <div className="space-y-3">
        {question.options?.map((option, idx) => {
          const isSelected = currentAnswer === option;
          return (
            <motion.button
              key={idx}
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
              onClick={() => !disabled && onAnswer(option)}
              disabled={disabled}
              className={`
                w-full p-4 text-left rounded-xl border transition-all duration-200
                ${isSelected 
                  ? `${theme.colors.button.primary} border-opacity-100 shadow-lg` 
                  : `${theme.colors.card.bg} ${theme.colors.card.border} ${!disabled ? 'hover:bg-white/10' : ''}`
                }
                ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}
              `}
            >
              <span className={`text-sm ${isSelected ? theme.colors.text.primary : theme.colors.text.secondary}`}>
                {option}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
