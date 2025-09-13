import React from 'react';
import { LogOut, Download, Settings, HelpCircle, User } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface AccountPageProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  profile?: {
    forms_generated?: number;
    downloads_count?: number;
  };
  isSubscribed: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onShowDownloadHistory: () => void;
  onShowSettings: () => void;
  onShowSupport: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  profile,
  isSubscribed,
  onLogin,
  onLogout,
  onShowDownloadHistory,
  onShowSettings,
  onShowSupport
}) => {
  if (!user) {
    return (
      <div className="flex-1 px-6 py-8 pb-32">
        <div className="max-w-md mx-auto">
          <GlassCard variant="strong" className="text-center">
            <GlassCardHeader>
              <div className="w-16 h-16 mx-auto rounded-full glass-surface flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <GlassCardTitle>Sign In Required</GlassCardTitle>
              <p className="text-muted-foreground">
                Sign in with Google to access your account and premium features
              </p>
            </GlassCardHeader>
            <GlassCardContent>
              <GlassButton
                variant="premium"
                size="lg"
                onClick={onLogin}
                className="w-full"
              >
                Sign in with Google
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Download,
      label: 'Download History',
      description: 'View your generated form guides',
      onClick: onShowDownloadHistory
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
      onClick: onShowSettings
    },
    {
      icon: HelpCircle,
      label: 'Support',
      description: 'Get help and contact us',
      onClick: onShowSupport
    }
  ];

  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Section */}
        <GlassCard variant="elevated">
          <GlassCardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-neon-primary/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full glass-surface flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {isSubscribed && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✦</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isSubscribed 
                      ? 'bg-neon-primary/20 text-neon-primary border border-neon-primary/30' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isSubscribed ? 'Premium Active' : 'Free Plan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats & Credits */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-neon-primary">{profile?.forms_generated || 0}</div>
                <div className="text-xs text-muted-foreground">Forms Generated</div>
              </div>
              <div className="glass-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-neon-secondary">{profile?.downloads_count || 0}</div>
                <div className="text-xs text-muted-foreground">Downloads</div>
              </div>
            </div>

            {/* Credits Status */}
            {!isSubscribed && (
              <div className="glass-surface rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Free Trial Credits</div>
                    <div className="text-sm text-muted-foreground">Remaining forms</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neon-primary">
                      {Math.max(0, 1 - (profile?.forms_generated || 0))}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 1 free</div>
                  </div>
                </div>
                {(profile?.forms_generated || 0) >= 1 && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Free trial completed! Upgrade to Premium for unlimited form explanations.
                    </p>
                  </div>
                )}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassButton
                key={index}
                variant="ghost"
                onClick={item.onClick}
                className="w-full justify-start h-auto p-4 glass-surface hover:glass-strong"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg glass-surface flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </GlassButton>
            );
          })}
        </div>

        {/* Sign Out */}
        <GlassButton
          variant="destructive"
          onClick={onLogout}
          className="w-full justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </GlassButton>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>FormWise v1.0.0</p>
          <p>Made with ❤️ for form filling</p>
        </div>
      </div>
    </div>
  );
};