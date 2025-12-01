import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Luxury Quiz!</h1>
            <p className="text-lg text-white mb-8">Test your knowledge and enjoy the experience.</p>
            <Link to="/quiz">
                <Button text="Start Quiz" onClick={() => {}} />
            </Link>
        </div>
    );
};

export default Home;