import React from 'react';

interface CardProps {
  title: string;
  content: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, content, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default Card;