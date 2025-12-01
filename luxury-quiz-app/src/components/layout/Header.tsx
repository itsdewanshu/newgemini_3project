import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 shadow-lg">
            <h1 className="text-white text-3xl font-bold">Luxury Quiz App</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="text-white hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link to="/quiz" className="text-white hover:underline">Quiz</Link>
                    </li>
                    <li>
                        <Link to="/results" className="text-white hover:underline">Results</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;