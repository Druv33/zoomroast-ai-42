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

  const label = language === 'english' ? 'English' : 'Hindi';
  const flag = language === 'english' ? '🇺🇸' : '🇮🇳';

  return (
    <GlassButton
      onClick={toggleLanguage}
      onMouseEnter={playHover}
      className="h-11 px-5 min-w-[130px] bg-black/20 backdrop-blur-md border border-white/10 
                 hover:bg-white/5 text-white font-medium shadow-lg hover:shadow-xl 
                 transition-all duration-300 hover:scale-[1.02] active:scale-95
                 rounded-xl group relative overflow-hidden"
      aria-label={`Switch language (current: ${label})`}
      title={`Switch language (current: ${label})`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <Globe className="h-4 w-4 mr-2 opacity-80" />
      <span className="text-sm font-medium flex items-center gap-2 relative z-10">
        <span className="text-base">{flag}</span>
        <span className="tracking-wide">{label}</span>
      </span>
    </GlassButton>
  );
};