import React from 'react';
import { motion } from 'framer-motion';
import { useCurrentTheme } from '../hooks/useCurrentTheme';

interface HomeScreenProps {
  onSelectMode: (mode: 'PRACTICE' | 'TEST' | 'ZEN' | 'CHALLENGER') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {
  const { theme } = useCurrentTheme();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-6">
      
      {/* Header Section */}
      <div className="text-center mb-12 space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-5xl font-bold tracking-tighter drop-shadow-lg ${theme.colors.text.primary}`}
        >
          Luxury Quiz
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3 }}
          className={`text-xs font-bold tracking-[0.3em] uppercase ${theme.colors.text.secondary}`}
        >
          Elevate Your Knowledge
        </motion.p>
      </div>

      {/* Mode Selection Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-5">
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('PRACTICE')}
          className={`group relative w-full py-4 px-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden ${theme.colors.button.secondary} hover:border-opacity-50`}
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold tracking-widest uppercase ${theme.colors.text.primary}`}>Practice</span>
            <span className={`text-xs opacity-60 ${theme.colors.text.secondary}`}>Casual</span>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('TEST')}
          className={`group relative w-full py-4 px-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden ${theme.colors.button.primary} hover:shadow-lg`}
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-white`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold tracking-widest uppercase ${theme.colors.text.primary}`}>Test</span>
            <span className={`text-xs opacity-80 ${theme.colors.text.primary}`}>Ranked</span>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('ZEN')}
          className={`group relative w-full py-4 px-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden ${theme.colors.button.secondary} hover:border-opacity-50`}
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold tracking-widest uppercase ${theme.colors.text.primary}`}>Zen</span>
            <span className={`text-xs opacity-60 ${theme.colors.text.secondary}`}>Relax</span>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('CHALLENGER')}
          className={`group relative w-full py-4 px-6 rounded-xl border transition-all duration-300 ease-out overflow-hidden bg-red-900/20 border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]`}
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-red-500`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold tracking-widest uppercase text-red-100`}>Challenger</span>
            <span className={`text-xs opacity-80 text-red-300`}>Hardcore</span>
          </div>
        </motion.button>

      </div>
    </div>
  );
};

export default HomeScreen;
