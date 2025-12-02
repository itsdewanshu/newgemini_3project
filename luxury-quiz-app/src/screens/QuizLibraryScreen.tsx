import React from 'react';
import { useQuizBank } from '../hooks/useQuizBank';
import { useCurrentTheme } from '../hooks/useCurrentTheme';

interface QuizLibraryScreenProps {
  onStartQuiz: (id: number) => void;
}

const QuizLibraryScreen: React.FC<QuizLibraryScreenProps> = ({ onStartQuiz }) => {
  const { quizSets } = useQuizBank();
  const { theme } = useCurrentTheme();

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Quiz Library</h2>
        <p className={`text-xs ${theme.colors.text.secondary}`}>Select a challenge to begin</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {quizSets.length === 0 ? (
          <div className={`text-center py-20 ${theme.colors.text.secondary}`}>
            <p>No quizzes available.</p>
            <p className="text-xs opacity-50 mt-2">Import or create a quiz to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizSets.map((quiz) => (
              <div 
                key={quiz.id}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between h-full min-h-[160px] ${theme.colors.card.bg} ${theme.colors.card.border}`}
              >
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme.colors.text.primary}`}>{quiz.title}</h3>
                  <p className={`text-xs line-clamp-2 mb-4 ${theme.colors.text.secondary}`}>
                    {quiz.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.colors.text.secondary}`}>
                    {quiz.questions.length} Questions
                  </span>
                  <button
                    onClick={() => quiz.id && onStartQuiz(quiz.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${theme.colors.button.primary} hover:shadow-lg`}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLibraryScreen;
