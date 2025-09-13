import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSound } from '@/hooks/useSound';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);
  const { speak } = useSound();

  const playWelcomeSound = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text: 'Welcome to SnapRoast!', voice: 'male' }
      });

      if (error || !data?.audioBase64) {
        // Fallback to browser speech synthesis
        console.log('Using browser speech synthesis fallback');
        speak('Welcome to SnapRoast!', 'male');
        return;
      }

      // Play TTS audio if available
      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Fallback if audio fails
        speak('Welcome to SnapRoast!', 'male');
      });
    } catch (error) {
      console.log('TTS failed, using browser speech synthesis:', error);
      speak('Welcome to SnapRoast!', 'male');
    }
  };

  useEffect(() => {
    // Play welcome sound only on first visit
    const hasPlayedWelcome = localStorage.getItem('hasPlayedWelcome');
    if (!hasPlayedWelcome) {
      playWelcomeSound();
      localStorage.setItem('hasPlayedWelcome', 'true');
    }
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
              <div className="absolute inset-0 rounded-xl glass-surface neon-glow animate-logo-pulse" />
              <Zap className="w-12 h-12 text-neon-primary relative z-10" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">SnapRoast</h1>
              <div className="w-32 h-1 bg-gradient-to-r from-neon-primary to-neon-secondary rounded-full shimmer mx-auto" />
            </div>
          </div>
        ) : (
          <div className="slide-up opacity-0 flex flex-col items-center">
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-xl glass-surface" />
              <Zap className="w-12 h-12 text-neon-primary relative z-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};