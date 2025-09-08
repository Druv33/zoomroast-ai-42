import React from 'react';
import { Home, CreditCard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';

interface BottomNavigationProps {
  currentPage: 'home' | 'subscription' | 'account';
  onPageChange: (page: 'home' | 'subscription' | 'account') => void;
  user?: any;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPage,
  onPageChange,
  user
}) => {
  const { playClick } = useSound();
  
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'subscription' as const, icon: CreditCard, label: 'Premium' },
    { id: 'account' as const, icon: User, label: 'Account' }
  ];

  const handleTabClick = (tabId: 'home' | 'subscription' | 'account') => {
    playClick();
    onPageChange(tabId);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 safe-area-bottom">
      <nav className="glass-strong rounded-xl px-6 py-4 neon-glow">
        <div className="flex items-center space-x-8">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 glass-hover",
                  "stagger-in opacity-0",
                  isActive && "glass-strong neon-glow-strong scale-110"
                )}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className={cn(
                  "flex items-center justify-center w-full h-full rounded-xl transition-all duration-300",
                  isActive ? "text-neon-primary" : "text-muted-foreground"
                )}>
                  {tab.id === 'account' && user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-neon-primary/50" 
                    />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-neon-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};