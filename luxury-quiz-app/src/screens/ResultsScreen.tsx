import React from 'react';
import { useCurrentTheme } from '../hooks/useCurrentTheme';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  notAttemptedCount: number;
  activeMode: string;
  quizTitle: string;
  onRetry: () => void;
  onLibrary: () => void;
  onHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  correctCount,
  incorrectCount,
  notAttemptedCount,
  activeMode,
  quizTitle,
  onRetry,
  onLibrary,
  onHome,
}) => {
  const { theme } = useCurrentTheme();

  // Feedback logic
  let feedback = '';
  if (score >= 90) feedback = 'Exceptional Mastery';
  else if (score >= 75) feedback = 'Excellent Performance';
  else if (score >= 50) feedback = 'Good Effort';
  else feedback = 'Room for Improvement';

  // Circle circumference for progress ring
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in gap-6 py-4">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className={`text-sm font-bold tracking-widest uppercase ${theme.colors.text.secondary}`}>
          {activeMode} Mode Results
        </h2>
        <h1 className={`text-xl font-bold ${theme.colors.text.primary}`}>
          {quizTitle}
        </h1>
      </div>

      {/* Score Ring */}
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${theme.colors.text.accent} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-black ${theme.colors.text.primary}`}>
            {score}%
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${theme.colors.text.secondary}`}>
            Score
          </span>
        </div>
      </div>

      {/* Feedback */}
      <div className={`text-lg font-medium ${theme.colors.text.accent}`}>
        {feedback}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className={`p-3 rounded-xl border text-center ${theme.colors.card.bg} ${theme.colors.card.border}`}>
          <div className="text-xl font-bold text-green-400">{correctCount}</div>
          <div className={`text-[10px] uppercase tracking-wider ${theme.colors.text.secondary}`}>Correct</div>
        </div>
        <div className={`p-3 rounded-xl border text-center ${theme.colors.card.bg} ${theme.colors.card.border}`}>
          <div className="text-xl font-bold text-red-400">{incorrectCount}</div>
          <div className={`text-[10px] uppercase tracking-wider ${theme.colors.text.secondary}`}>Wrong</div>
        </div>
        <div className={`p-3 rounded-xl border text-center ${theme.colors.card.bg} ${theme.colors.card.border}`}>
          <div className="text-xl font-bold text-slate-400">{notAttemptedCount}</div>
          <div className={`text-[10px] uppercase tracking-wider ${theme.colors.text.secondary}`}>Skipped</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3 mt-2">
        <button 
          onClick={onRetry}
          className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider ${theme.colors.button.primary} ${theme.colors.button.hover}`}
        >
          Retry Quiz
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onLibrary}
            className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider ${theme.colors.button.secondary} hover:bg-white/10`}
          >
            Library
          </button>
          <button 
            onClick={onHome}
            className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider ${theme.colors.button.secondary} hover:bg-white/10`}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
