import React from 'react';
import { Globe } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useSound } from '@/hooks/useSound';

export const LanguageSelector: React.FC<{ onChange?: (lang: Language) => void }> = ({ onChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const { playClick, playHover } = useSound();

  const toggleLanguage = () => {
    playClick();
    const next = language === 'english' ? 'hindi' : 'english';
    setLanguage(next);
    onChange?.(next);
  };

  const label = language === 'english' ? t('englishLang') : t('hindiLang');
  const flag = language === 'english' ? '🇺🇸' : '🇮🇳';

  return (
    <GlassButton
      onClick={toggleLanguage}
      onMouseEnter={playHover}
      className="h-12 px-6 min-w-[140px] bg-gradient-to-r from-hsl(var(--neon-primary)) to-hsl(var(--neon-secondary)) 
                 hover:from-hsl(var(--neon-secondary)) hover:to-hsl(var(--neon-tertiary)) 
                 text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 
                 hover:scale-105 active:scale-95 neon-glow"
      aria-label={`Switch language (current: ${label})`}
      title={`Switch language (current: ${label})`}
    >
      <Globe className="h-5 w-5 mr-2 drop-shadow-sm" />
      <span className="text-sm font-semibold flex items-center gap-2 drop-shadow-sm">
        <span className="text-lg">{flag}</span>
        <span>{label}</span>
      </span>
    </GlassButton>
  );
};