import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;