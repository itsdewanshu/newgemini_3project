import React from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useCurrentTheme } from '../hooks/useCurrentTheme';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  notAttemptedCount: number;
  averageTimePerQuestion: number;
  longestStreak: number;
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
  averageTimePerQuestion,
  longestStreak,
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

  const handleShare = async () => {
    const element = document.getElementById('score-card');
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a', // slate-900
        scale: 2, // Better quality
      });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `quiz-result-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in gap-6 py-4">
      
      <div id="score-card" className="flex flex-col items-center w-full p-6 rounded-2xl bg-slate-900/50">
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h2 className={`text-sm font-bold tracking-widest uppercase ${theme.colors.text.secondary}`}>
            {activeMode} Mode Results
          </h2>
          <h1 className={`text-xl font-bold ${theme.colors.text.primary}`}>
            {quizTitle}
          </h1>
        </div>

        {/* Score Ring */}
        <div className="relative flex items-center justify-center mb-6">
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
        <div className={`text-lg font-medium ${theme.colors.text.accent} mb-8`}>
          {feedback}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-400">{correctCount}</div>
            <div className="text-xs text-green-500/70 uppercase tracking-wider mt-1">Correct</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-red-400">{incorrectCount}</div>
            <div className="text-xs text-red-500/70 uppercase tracking-wider mt-1">Incorrect</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-gray-400">{notAttemptedCount}</div>
            <div className="text-xs text-gray-500/70 uppercase tracking-wider mt-1">Skipped</div>
          </motion.div>
        </div>

        {/* Advanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-400">{averageTimePerQuestion.toFixed(1)}s</div>
            <div className="text-xs text-blue-500/70 uppercase tracking-wider mt-1">Avg Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
            <div className="text-xs text-purple-500/70 uppercase tracking-wider mt-1">Best Streak</div>
          </motion.div>
        </div>
      </div>      {/* Actions */}
      <div className="flex flex-col w-full gap-3 mt-2">
        <button 
          onClick={handleShare}
          className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30`}
        >
          Share Result
        </button>
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
