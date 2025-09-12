import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    // Logo animation sequence
    const logoTimer = setTimeout(() => {
      setLogoVisible(false);
    }, 1500);

    // Complete splash sequence
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {logoVisible ? (
          <div className="bounce-in flex flex-col items-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-xl glass-surface neon-glow animate-pulse" />
              <Sparkles className="w-12 h-12 text-neon-primary relative z-10" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">StyleAI</h1>
              <p className="text-sm text-muted-foreground mb-4">Fashion • Beauty • Home Decor</p>
              <div className="w-32 h-1 bg-gradient-to-r from-neon-primary to-neon-secondary rounded-full shimmer mx-auto" />
            </div>
          </div>
        ) : (
          <div className="slide-up opacity-0 flex flex-col items-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-xl glass-surface" />
              <Sparkles className="w-12 h-12 text-neon-primary relative z-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};