import { useCallback } from 'react';
import { soundUtils } from '@/utils/soundUtils';
export const useSound = () => {

  const playClick = useCallback(() => {
    soundUtils.playClickSound();
  }, []);

  const playHover = useCallback(() => {
    soundUtils.playHoverSound();
  }, []);

  const speak = useCallback((text: string, voice: 'male' | 'female' = 'male', lang: 'english' | 'hindi' = 'english') => {
    soundUtils.speakText(text, voice, lang);
  }, []);

  return {
    playClick,
    playHover,
    speak
  };
};