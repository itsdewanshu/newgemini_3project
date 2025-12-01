import React from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/common/Card';

const Results: React.FC = () => {
    const location = useLocation();
    const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 0 };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <Card>
                <h1 className="text-2xl font-bold text-white">Quiz Results</h1>
                <p className="text-lg text-white mt-4">You scored {score} out of {totalQuestions}!</p>
                <p className="text-md text-white mt-2">
                    {score / totalQuestions >= 0.7 ? 'Great job!' : 'Better luck next time!'}
                </p>
            </Card>
        </div>
    );
};

export default Results;