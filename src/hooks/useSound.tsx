import { useCallback } from 'react';
import { soundUtils } from '@/utils/soundUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSound = () => {
  const { language } = useLanguage();

  const playClick = useCallback(() => {
    soundUtils.playClickSound();
  }, []);

  const playHover = useCallback(() => {
    soundUtils.playHoverSound();
  }, []);

  const speak = useCallback((text: string, voice: 'male' | 'female' = 'male', lang: 'english' | 'hindi' = language) => {
    soundUtils.speakText(text, voice, lang);
  }, [language]);

  return {
    playClick,
    playHover,
    speak
  };
};