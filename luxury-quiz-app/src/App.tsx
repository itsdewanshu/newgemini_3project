import { useState } from 'react';

// Define the possible screens for our app
type Screen = 'home' | 'quiz' | 'results';

function App() {
  // State to manage the current view
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center p-4 text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* Main Content Container */}
      <main className="w-full max-w-lg transition-all duration-700 ease-out">
        
        {currentScreen === 'home' && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
            
            {/* Decorative ambient glow (Neon Zen) */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <h1 className="mb-2 text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-sm">
                Luxury Quiz
              </h1>
              
              <p className="mb-10 text-xs font-medium tracking-[0.2em] text-amber-500/60 uppercase">
                Premium Knowledge Engine
              </p>

              <button 
                onClick={() => setCurrentScreen('quiz')}
                className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 ease-out"
              >
                <span className="text-sm font-semibold tracking-wide text-slate-300 group-hover:text-amber-200 transition-colors">
                  BEGIN EXPERIENCE
                </span>
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300"></div>
              </button>
            </div>
          </div>
        )}

        {/* Placeholders for future screens */}
        {currentScreen === 'quiz' && (
           <div className="text-center text-slate-500 animate-pulse">Quiz Interface Loading...</div>
        )}
        
        {currentScreen === 'results' && (
           <div className="text-center text-slate-500 animate-pulse">Results Interface Loading...</div>
        )}

      </main>
    </div>
  );
}

export default App;