import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export const LanguageSelector: React.FC<{ onChange?: (lang: Language) => void }> = ({ onChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const next = language === 'english' ? 'hindi' : 'english';
    setLanguage(next);
    onChange?.(next);
  };

  const label = language === 'english' ? t('englishLang') : t('hindiLang');
  const flag = language === 'english' ? '🇺🇸' : '🇮🇳';

  return (
    <Button
      variant="secondary"
      size="sm"
      className="glass-surface h-9 px-4"
      onClick={toggleLanguage}
      aria-label={`Switch language (current: ${label})`}
      title={`Switch language (current: ${label})`}
    >
      <Globe className="h-4 w-4 mr-2" />
      <span className="text-sm font-medium flex items-center gap-2">
        <span>{flag}</span>
        <span>{label}</span>
      </span>
    </Button>
  );
};