import React from 'react';
import AnswerOption from './AnswerOption';

interface QuestionCardProps {
  question: string;
  answerOptions: string[];
  onAnswerSelected: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answerOptions, onAnswerSelected }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <div className="space-y-2">
        {answerOptions.map((option, index) => (
          <AnswerOption key={index} optionText={option} onClick={() => onAnswerSelected(option)} />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;