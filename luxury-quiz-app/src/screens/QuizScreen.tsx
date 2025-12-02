import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { useCurrentTheme } from '../hooks/useCurrentTheme';
import { useSoundEffects } from '../hooks/useSoundEffects';
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
  const { activeQuizSet, activeMode, activeConfig, clearActiveQuiz } = useQuizStore();
  const { theme } = useCurrentTheme();
  const { playClick, playCorrect, playIncorrect } = useSoundEffects();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeConfig?.timeLimit || 30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());

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

    setTimeLeft(activeConfig?.timeLimit || 30); // Reset timer on question change

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

  // Sound effect on result
  useEffect(() => {
    if (result) {
      if (result.score >= 50) playCorrect();
      else playIncorrect();
    }
  }, [result, playCorrect, playIncorrect]);

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
    
    playClick();

    setSession(prev => prev ? answerQuestion(prev, currentQuestion!.id, option) : null);
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

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    const newSet = new Set(markedQuestions);
    if (newSet.has(currentQuestion.id)) newSet.delete(currentQuestion.id);
    else newSet.add(currentQuestion.id);
    setMarkedQuestions(newSet);
  };

  const handleMarkReview = () => {
    toggleMarkForReview();
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
  const currentAnswer = session.answers[currentQuestion.id];
  const isMarked = markedQuestions.has(currentQuestion.id);

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
              
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mt-4">
                <h3 className="text-xs uppercase tracking-wider text-white/50 mb-3">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2">
                  {activeQuizSet.questions.map((q, idx) => {
                    const isAnswered = !!session.answers[q.id];
                    const isMarked = markedQuestions.has(q.id);
                    const isCurrent = session.currentIndex === idx;
                    
                    // NTA Style Logic:
                    // Green = Answered, Red = Not Answered (but visited? simplified here to default), Purple = Marked
                    let bgClass = "bg-white/5 border-white/10 text-white/50"; // Not Visited/Default
                    if (isAnswered) bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-500";
                    if (isMarked && !isAnswered) bgClass = "bg-purple-500/20 border-purple-500 text-purple-500";
                    if (isMarked && isAnswered) bgClass = "bg-purple-500/20 border-purple-500 text-purple-500 relative"; // Needs green dot
                    if (isCurrent) bgClass += " ring-1 ring-white shadow-[0_0_10px_rgba(255,255,255,0.3)]";

                    return (
                      <button 
                        key={q.id} 
                        onClick={() => handleGoTo(idx)}
                        className={`h-8 w-8 rounded-lg text-xs font-medium border flex items-center justify-center transition-all ${bgClass}`}
                      >
                        {idx + 1}
                        {isMarked && isAnswered && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
                {/* Add "Mark for Review" button near Next/Prev controls */}
                <button onClick={toggleMarkForReview} className="mt-4 w-full py-2 text-xs border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10">Mark for Review</button>
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
