export type ThemeMode = 'practice' | 'test' | 'zen';

export interface Theme {
  id: ThemeMode;
  name: string;
  colors: {
    background: string; // Main app background gradient
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    card: {
      bg: string;
      border: string;
      shadow: string;
      backdrop: string;
    };
    button: {
      primary: string;
      secondary: string;
      hover: string;
    };
  };
}

export const practiceTheme: Theme = {
  id: 'practice',
  name: 'Practice Mode',
  colors: {
    background: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-400',
      accent: 'text-cyan-400',
    },
    card: {
      bg: 'bg-white/5',
      border: 'border-white/10',
      shadow: 'shadow-xl shadow-blue-900/20',
      backdrop: 'backdrop-blur-md',
    },
    button: {
      primary: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
      secondary: 'bg-white/5 text-slate-300 border-white/10',
      hover: 'hover:bg-cyan-500/30 hover:border-cyan-400/50',
    },
  },
};

export const testTheme: Theme = {
  id: 'test',
  name: 'Luxury Test',
  colors: {
    background: 'bg-gradient-to-br from-slate-950 via-black to-slate-900',
    text: {
      primary: 'text-slate-200',
      secondary: 'text-amber-500/60',
      accent: 'text-amber-400',
    },
    card: {
      bg: 'bg-black/40',
      border: 'border-amber-500/20',
      shadow: 'shadow-2xl shadow-amber-900/10',
      backdrop: 'backdrop-blur-xl',
    },
    button: {
      primary: 'bg-amber-500/10 text-amber-200 border-amber-500/30',
      secondary: 'bg-white/5 text-slate-400 border-white/10',
      hover: 'hover:bg-amber-500/20 hover:border-amber-500/50',
    },
  },
};

export const zenTheme: Theme = {
  id: 'zen',
  name: 'Neon Zen',
  colors: {
    background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950',
    text: {
      primary: 'text-fuchsia-100',
      secondary: 'text-purple-300/70',
      accent: 'text-fuchsia-400',
    },
    card: {
      bg: 'bg-purple-900/20',
      border: 'border-fuchsia-500/20',
      shadow: 'shadow-[0_0_30px_rgba(192,38,211,0.15)]',
      backdrop: 'backdrop-blur-lg',
    },
    button: {
      primary: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30',
      secondary: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20',
      hover: 'hover:bg-fuchsia-500/30 hover:border-fuchsia-400/50 hover:shadow-[0_0_15px_rgba(192,38,211,0.3)]',
    },
  },
};

export const themes: Record<ThemeMode, Theme> = {
  practice: practiceTheme,
  test: testTheme,
  zen: zenTheme,
};
