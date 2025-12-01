import React from 'react';

interface AnswerOptionProps {
    optionText: string;
    onClick: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ optionText, onClick }) => {
    return (
        <button
            className="w-full p-4 mb-2 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClick}
        >
            {optionText}
        </button>
    );
};

export default AnswerOption;