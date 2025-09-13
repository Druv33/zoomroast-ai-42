import React from 'react';
import { FileText } from 'lucide-react';


interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  profile?: {
    forms_generated?: number;
  };
  isSubscribed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "FormWise", 
  showLogo = true,
  profile,
  isSubscribed = false
}) => {
  
  
  return (
    <header className="safe-area-top px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showLogo && (
            <div className="relative w-10 h-10 rounded-lg glass-surface flex items-center justify-center">
              <FileText className="w-5 h-5 text-neon-primary" />
            </div>
          )}
          <h1 className="text-xl font-semibold text-foreground">FormWise</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Credits Display */}
          {profile && !isSubscribed && (
            <div className="glass-surface rounded-lg px-3 py-1">
              <div className="text-xs text-muted-foreground">Credits</div>
              <div className="text-sm font-semibold text-neon-primary">
                {Math.max(0, 1 - (profile.forms_generated || 0))} / 1
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};