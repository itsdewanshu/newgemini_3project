import { useState } from 'react';
import { Theme, ThemeMode, themes } from '../theme/themeConfig';

export function useCurrentTheme(initialMode: ThemeMode = 'test') {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const theme = themes[mode];

  const switchTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return { theme, mode, switchTheme };
}
