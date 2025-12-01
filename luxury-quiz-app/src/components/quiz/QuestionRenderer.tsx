import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../../types/quizTypes';
import { useCurrentTheme } from '../../hooks/useCurrentTheme';
import MatchQuestion from './MatchQuestion';

interface QuestionRendererProps {
  question: Question;
  currentAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
  disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswer,
  disabled = false,
}) => {
  const { theme } = useCurrentTheme();

  const renderMCQ = () => (
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
  );

  const renderTrueFalse = () => (
    <div className="grid grid-cols-2 gap-4">
      {['True', 'False'].map((option) => {
        const isSelected = currentAnswer === option;
        return (
          <motion.button
            key={option}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && onAnswer(option)}
            disabled={disabled}
            className={`
              p-8 rounded-xl border text-center transition-all duration-200
              ${isSelected 
                ? `${theme.colors.button.primary} border-opacity-100 shadow-lg` 
                : `${theme.colors.card.bg} ${theme.colors.card.border} ${!disabled ? 'hover:bg-white/10' : ''}`
              }
              ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}
            `}
          >
            <span className={`text-xl font-bold ${isSelected ? theme.colors.text.primary : theme.colors.text.secondary}`}>
              {option}
            </span>
          </motion.button>
        );
      })}
    </div>
  );

  const renderFillBlank = () => (
    <div className="w-full">
      <input
        type="text"
        value={(currentAnswer as string) || ''}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here..."
        className={`
          w-full p-4 rounded-xl border bg-transparent outline-none transition-all duration-200
          ${theme.colors.text.primary}
          ${theme.colors.card.border}
          focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
          placeholder:text-slate-600
        `}
      />
    </div>
  );

  const renderMatch = () => (
    <MatchQuestion
      leftItems={question.options || []}
      rightItems={question.correctAnswers || []}
      currentAnswer={currentAnswer as string[]}
      onAnswer={onAnswer}
      disabled={disabled}
    />
  );

  return (
    <div className="flex-1 flex flex-col justify-center mb-8 w-full">
      <h3 className={`text-xl md:text-2xl font-medium leading-relaxed mb-8 ${theme.colors.text.primary}`}>
        {question.questionText}
      </h3>

      {question.type === 'mcq_single' && renderMCQ()}
      {question.type === 'true_false' && renderTrueFalse()}
      {question.type === 'fill_blank' && renderFillBlank()}
      {question.type === 'match' && renderMatch()}
      
      {/* Fallback for unknown types */}
      {!['mcq_single', 'true_false', 'fill_blank', 'match'].includes(question.type) && (
        <div className="text-red-400">Unsupported question type: {question.type}</div>
      )}
    </div>
  );
};

export default QuestionRenderer;
