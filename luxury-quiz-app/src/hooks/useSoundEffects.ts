import { useCallback } from 'react';

// Placeholder URLs - using Mixkit free previews for demonstration
// In production, these should be local assets in the public/ folder
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Pop
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3', // Error tone
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft tick
};

export const useSoundEffects = () => {
  const playSound = useCallback((url: string, volume = 0.5) => {
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      // Reset time to allow rapid replay
      audio.currentTime = 0;
      audio.play().catch((err) => {
        // Ignore autoplay errors (common if user hasn't interacted yet)
        // or if the URL is blocked/invalid
        console.warn('Audio play failed:', err);
      });
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }, []);

  const playClick = useCallback(() => playSound(SOUNDS.click, 0.5), [playSound]);
  const playCorrect = useCallback(() => playSound(SOUNDS.correct, 0.6), [playSound]);
  const playIncorrect = useCallback(() => playSound(SOUNDS.incorrect, 0.4), [playSound]);
  const playHover = useCallback(() => playSound(SOUNDS.hover, 0.1), [playSound]);

  return {
    playClick,
    playCorrect,
    playIncorrect,
    playHover,
  };
};
