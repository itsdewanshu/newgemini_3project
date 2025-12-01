import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCurrentTheme } from './hooks/useCurrentTheme';
import { useQuizBank } from './hooks/useQuizBank';
import { useQuizStore } from './store/quizStore';
import { deleteQuizSet } from './db/quizDb';
import { ThemeMode } from './theme/themeConfig';
import HomeScreen from './screens/HomeScreen';
import QuizLibraryScreen from './screens/QuizLibraryScreen';
import QuizScreen from './screens/QuizScreen';
import SettingsScreen from './screens/SettingsScreen';
import ImportExportScreen from './screens/ImportExportScreen';
import QuizEditorScreen from './screens/QuizEditorScreen';
import ZenParticles from './components/layout/ZenParticles';

// Define the possible screens for our app
export type Screen = 'HOME' | 'LIBRARY' | 'QUIZ' | 'SETTINGS' | 'IMPORT_EXPORT' | 'EDITOR';

function App() {
  // State to manage the current view
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [pendingMode, setPendingMode] = useState<'PRACTICE' | 'TEST' | 'ZEN' | 'CHALLENGER' | null>(null);
  
  // Theme management
  const { theme, switchTheme, mode } = useCurrentTheme();
  
  // Quiz Data
  const { quizSets, refresh } = useQuizBank();
  const { setActiveQuizSet } = useQuizStore();

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['practice', 'test', 'zen', 'challenger'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    switchTheme(modes[nextIndex]);
  };

  const handleModeSelect = (selectedMode: 'PRACTICE' | 'TEST' | 'ZEN' | 'CHALLENGER') => {
    console.log('Mode selected:', selectedMode);
    setPendingMode(selectedMode);
    switchTheme(selectedMode.toLowerCase() as ThemeMode);
    setCurrentScreen('IMPORT_EXPORT');
  };

  const handleStartQuiz = (id: number) => {
    console.log('Starting quiz:', id);
    const selectedQuiz = quizSets.find(q => q.id === id);
    if (selectedQuiz) {
      setActiveQuizSet(selectedQuiz, pendingMode || 'PRACTICE');
      setCurrentScreen('QUIZ');
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await deleteQuizSet(id);
      refresh();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME': return <HomeScreen onSelectMode={handleModeSelect} />;
      case 'LIBRARY': return <QuizLibraryScreen />;
      case 'QUIZ': return <QuizScreen onExit={() => setCurrentScreen('IMPORT_EXPORT')} />;
      case 'SETTINGS': return <SettingsScreen />;
      case 'EDITOR': return <QuizEditorScreen onExit={() => setCurrentScreen('IMPORT_EXPORT')} />;
      case 'IMPORT_EXPORT': return (
        <ImportExportScreen 
          quizSets={quizSets} 
          onImportSuccess={refresh} 
          onStartQuiz={handleStartQuiz}
          onDeleteQuiz={handleDeleteQuiz}
          onOpenEditor={() => setCurrentScreen('EDITOR')}
        />
      );
      default: return <HomeScreen onSelectMode={handleModeSelect} />;
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 font-sans transition-colors duration-700 ease-in-out ${theme.colors.background} ${theme.colors.text.primary}`}>
      
      {/* Zen Mode Particles */}
      {mode === 'zen' && <ZenParticles />}

      {/* Theme Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={cycleTheme}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${theme.colors.button.secondary} hover:bg-white/10`}
        >
          {theme.name}
        </button>
      </div>

      {/* Main Content Container */}
      <main className={`w-full ${currentScreen === 'EDITOR' ? 'max-w-5xl' : 'max-w-lg'} min-h-[400px] transition-all duration-700 ease-out relative overflow-hidden rounded-3xl border p-10 ${theme.colors.card.bg} ${theme.colors.card.border} ${theme.colors.card.shadow} ${theme.colors.card.backdrop}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Menu (for prototype navigation) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl z-50">
        {(['HOME', 'LIBRARY', 'QUIZ', 'SETTINGS', 'IMPORT_EXPORT'] as Screen[]).map((s) => (
          <button 
            key={s} 
            onClick={() => setCurrentScreen(s)} 
            className={`px-3 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 ${currentScreen === s ? theme.colors.button.primary : 'text-slate-500 hover:text-slate-300'}`}
          >
            {s}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;