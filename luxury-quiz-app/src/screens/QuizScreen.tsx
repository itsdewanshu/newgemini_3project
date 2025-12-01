import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { useCurrentTheme } from '../hooks/useCurrentTheme';
import ResultsScreen from './ResultsScreen';
import QuestionRenderer from '../components/quiz/QuestionRenderer';
import { 
  createQuizSession, 
  answerQuestion, 
  goNext, 
  goPrev, 
  goToQuestion,
  markForReview,
  calculateScore,
  shouldAllowBack, 
  QuizSession, 
  QuizResult 
} from '../engine/quizEngine';interface QuizScreenProps {
  onExit: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ onExit }) => {
  const { activeQuizSet, activeMode, clearActiveQuiz } = useQuizStore();
  const { theme } = useCurrentTheme();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (activeQuizSet) {
      setSession(createQuizSession(activeQuizSet.questions, (activeMode as any) || 'PRACTICE'));
    }
  }, [activeQuizSet]);

  // Derived state for current question
  const currentQuestion = useMemo(() => {
    if (!activeQuizSet || !session) return null;
    const questionId = session.questionIds[session.currentIndex];
    return activeQuizSet.questions.find(q => q.id === questionId);
  }, [activeQuizSet, session]);

  // Keyboard Shortcuts
  useEffect(() => {
    if (!activeQuizSet || !session || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'n':
        case 'N':
          setSession(prev => prev ? goNext(prev) : null);
          break;
        case 'p':
        case 'P':
          setSession(prev => prev ? goPrev(prev) : null);
          break;
        case 'm':
        case 'M':
          setSession(prev => prev ? markForReview(prev, currentQuestion.id) : null);
          break;
        case 'Enter':
          if (session.currentIndex === activeQuizSet.questions.length - 1) {
            if (window.confirm('Are you sure you want to submit?')) {
              const scoreResult = calculateScore(session, activeQuizSet.questions);
              setResult(scoreResult);
            }
          } else {
            setSession(prev => prev ? goNext(prev) : null);
          }
          break;
        case 'Escape':
          setIsPaletteOpen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuizSet, session, currentQuestion]);

  // Unlock interface when question changes
  useEffect(() => {
    setIsProcessing(false);
  }, [session?.currentIndex]);

  // Timer for Challenger Mode
  useEffect(() => {
    if (activeMode !== 'CHALLENGER' || !session || !currentQuestion || result || isProcessing) return;

    setTimeLeft(30); // Reset timer on question change

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up! Auto-advance
          if (session.currentIndex === activeQuizSet!.questions.length - 1) {
             const scoreResult = calculateScore(session, activeQuizSet!.questions);
             setResult(scoreResult);
          } else {
             setIsProcessing(true);
             setSession(prevSession => prevSession ? goNext(prevSession) : null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.currentIndex, activeMode, result, isProcessing]);

  if (!activeQuizSet) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in gap-4">
        <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>No Active Quiz</h2>
        <p className={`text-sm ${theme.colors.text.secondary}`}>Please select a quiz from the library.</p>
        <button 
          onClick={onExit}
          className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${theme.colors.button.primary} ${theme.colors.button.hover}`}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!session || !currentQuestion) {
    return <div className="text-center p-10">Loading Quiz...</div>;
  }

  // Handlers
  const handleAnswer = (option: string | string[]) => {
    if (isProcessing) return;
    setSession(prev => prev ? answerQuestion(prev, currentQuestion.id, option) : null);
  };

  const handleNext = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSession(prev => prev ? goNext(prev) : null);
  };

  const handlePrev = () => {
    if (isProcessing) return;
    setSession(prev => prev ? goPrev(prev) : null);
  };

  const handleGoTo = (index: number) => {
    if (isProcessing) return;
    setSession(prev => prev ? goToQuestion(prev, index) : null);
    setIsPaletteOpen(false);
  };

  const handleMarkReview = () => {
    if (isProcessing) return;
    if (session && currentQuestion) {
      setSession(markForReview(session, currentQuestion.id));
    }
  };

  const handleSubmit = () => {
    if (isProcessing) return;
    if (window.confirm('Are you sure you want to submit?')) {
      setIsProcessing(true);
      const scoreResult = calculateScore(session, activeQuizSet.questions);
      setResult(scoreResult);
    }
  };

  const handleRetry = () => {
    if (activeQuizSet) {
      setSession(createQuizSession(activeQuizSet.questions, (activeMode as any) || 'PRACTICE'));
      setResult(null);
    }
  };

  // Result View
  if (result) {
    return (
      <ResultsScreen
        score={result.score}
        totalQuestions={activeQuizSet.questions.length}
        correctCount={result.correctCount}
        incorrectCount={result.incorrectCount}
        notAttemptedCount={activeQuizSet.questions.length - result.correctCount - result.incorrectCount}
        averageTimePerQuestion={result.averageTimePerQuestion || 0}
        longestStreak={result.longestStreak || 0}
        activeMode={activeMode || 'PRACTICE'}
        quizTitle={activeQuizSet.title}
        onRetry={handleRetry}
        onLibrary={() => { clearActiveQuiz(); onExit(); }}
        onHome={() => { clearActiveQuiz(); onExit(); }}
      />
    );
  }

  // Active Quiz View
  const currentAnswer = session.answers[currentQuestion.id]?.[0]; // Single choice for now
  const isMarked = session.reviewList.includes(currentQuestion.id);

  return (
    <div className="flex flex-col h-full w-full animate-fade-in relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className={`p-2 rounded-lg ${theme.colors.button.secondary} hover:bg-white/10`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className={`text-xs font-bold tracking-widest uppercase ${theme.colors.text.secondary}`}>
            {activeMode} Mode
          </span>
          {activeMode === 'CHALLENGER' && (
             <span className={`text-xs font-bold tracking-widest text-red-400 ml-2`}>
               {timeLeft}s
             </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={handleMarkReview}
            className={`p-2 rounded-lg transition-colors ${isMarked ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'}`}
            title="Mark for Review"
          >
            <svg className="w-5 h-5" fill={isMarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <span className={`text-xs font-bold tracking-widest ${theme.colors.text.primary}`}>
            {session.currentIndex + 1} / {activeQuizSet.questions.length}
          </span>
        </div>
      </div>

      {/* Question Palette Overlay */}
      <AnimatePresence>
        {isPaletteOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaletteOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute top-0 left-0 bottom-0 w-64 z-50 border-r p-6 overflow-y-auto ${theme.colors.card.bg} ${theme.colors.card.border}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${theme.colors.text.primary}`}>Questions</h3>
                <button onClick={() => setIsPaletteOpen(false)} className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {session.questionIds.map((id, idx) => {
                  const isAnswered = !!session.answers[id];
                  const isReview = session.reviewList.includes(id);
                  const isCurrent = idx === session.currentIndex;
                  
                  let bgClass = 'bg-white/5 text-slate-400 border-transparent';
                  if (isCurrent) bgClass = `${theme.colors.button.primary} text-white border-white/20`;
                  else if (isReview) bgClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                  else if (isAnswered) bgClass = 'bg-green-500/20 text-green-400 border-green-500/30';

                  return (
                    <button
                      key={id}
                      onClick={() => handleGoTo(idx)}
                      className={`aspect-square rounded-lg text-xs font-bold border flex items-center justify-center transition-all ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded bg-white/5`}></div> Not Visited</div>
                <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded bg-green-500/20 border border-green-500/30`}></div> Answered</div>
                <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30`}></div> Review</div>
                <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded ${theme.colors.button.primary}`}></div> Current</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Question Renderer */}
      <QuestionRenderer 
        question={currentQuestion}
        currentAnswer={currentAnswer}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
        {shouldAllowBack(session) ? (
          <button
            onClick={handlePrev}
            disabled={session.currentIndex === 0}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${session.currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'} ${theme.colors.text.secondary}`}
          >
            Previous
          </button>
        ) : (
          <div /> // Spacer
        )}

        {session.currentIndex === activeQuizSet.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${theme.colors.button.primary} ${theme.colors.button.hover}`}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${theme.colors.button.secondary} hover:bg-white/10`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
