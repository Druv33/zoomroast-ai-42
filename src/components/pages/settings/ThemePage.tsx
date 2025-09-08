import React, { useState, useEffect } from 'react';
import { ArrowLeft, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useTheme } from 'next-themes';

interface ThemePageProps {
  onBack: () => void;
}

type ThemeOption = 'light' | 'dark' | 'system';

export const ThemePage: React.FC<ThemePageProps> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="w-5 h-5" />,
      description: 'Clean and bright interface'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="w-5 h-5" />,
      description: 'Easy on the eyes'
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Follow your device settings'
    }
  ];

  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <GlassButton variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </GlassButton>
        </div>

        <GlassCard variant="elevated" className="mb-6">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Theme
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        <div className="space-y-3">
          {themeOptions.map((option) => (
            <GlassButton
              key={option.value}
              variant={theme === option.value ? "default" : "ghost"}
              onClick={() => setTheme(option.value)}
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg ${
                  theme === option.value ? 'bg-primary/20' : 'glass-surface'
                } flex items-center justify-center`}>
                  {option.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {theme === option.value && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
                )}
              </div>
            </GlassButton>
          ))}
        </div>

        <GlassCard variant="strong" className="mt-8">
          <GlassCardContent className="p-4 text-center text-sm text-muted-foreground">
            <p>Theme changes are applied immediately</p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};