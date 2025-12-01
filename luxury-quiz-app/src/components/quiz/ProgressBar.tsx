import React from 'react';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestionIndex, totalQuestions }) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;