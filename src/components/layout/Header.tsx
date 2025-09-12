import React from 'react';
import { Sparkles, Coins } from 'lucide-react';

interface HeaderProps {
  credits?: number;
  maxCredits?: number;
  profile?: any;
  isSubscribed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  credits = 0, 
  maxCredits = 1,
  profile,
  isSubscribed
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 safe-area-top">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg glass-surface">
            <Sparkles className="w-5 h-5 text-neon-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">StyleAI</span>
        </div>

        {/* Credits Display */}
        <div className="glass-strong rounded-lg px-3 py-2 flex items-center space-x-2">
          <Coins className="w-4 h-4 text-neon-primary" />
          <span className="text-sm font-medium text-foreground">
            {credits}/{isSubscribed ? '∞' : maxCredits}
          </span>
        </div>
      </div>
    </header>
  );
};