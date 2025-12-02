import { useCallback, useMemo } from 'react';

// Placeholder URLs - using Mixkit free previews for demonstration
// In production, these should be local assets in the public/ folder
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Pop
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3', // Error tone
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft tick
};

const initializeAudio = (url: string, volume: number) => {
  try {
    const audio = new Audio(url);
    audio.volume = volume;
    // Start loading the audio immediately
    audio.preload = 'auto';
    return audio;
  } catch (error) {
    console.error('Audio initialization failed for', url, error);
    return null;
  }
};

export const useSoundEffects = () => {
  // Use useMemo to initialize and cache the Audio objects once (PERFORMANCE FIX)
  const audioRefs = useMemo(() => ({
    click: initializeAudio(SOUNDS.click, 0.5),
    correct: initializeAudio(SOUNDS.correct, 0.6),
    incorrect: initializeAudio(SOUNDS.incorrect, 0.4),
    hover: initializeAudio(SOUNDS.hover, 0.1),
  }), []);

  const playSound = useCallback((audio: HTMLAudioElement | null) => {
    if (audio) {
      try {
        // Reset time and play to allow rapid, uninterrupted playback (PERFORMANCE FIX)
        audio.currentTime = 0;
        // Use a slight timeout to minimize risk of "The play() request was interrupted" error
        setTimeout(() => {
          audio.play().catch(() => {}); // Ignore autoplay errors silently
        }, 1);
      } catch (error) {
        console.warn('Audio play failed:', error);
      }
    }
  }, []);

  const playClick = useCallback(() => playSound(audioRefs.click), [playSound, audioRefs.click]);
  const playCorrect = useCallback(() => playSound(audioRefs.correct), [playSound, audioRefs.correct]);
  const playIncorrect = useCallback(() => playSound(audioRefs.incorrect), [playSound, audioRefs.incorrect]);
  const playHover = useCallback(() => playSound(audioRefs.hover), [playSound, audioRefs.hover]);

  return {
    playClick,
    playCorrect,
    playIncorrect,
    playHover,
  };
};
