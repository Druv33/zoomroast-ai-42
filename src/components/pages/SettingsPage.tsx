import React, { useState } from 'react';
import { ArrowLeft, Settings, Volume2, Bell, Palette, Info } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AudioSettingsPage } from './settings/AudioSettingsPage';
import { NotificationsPage } from './settings/NotificationsPage';
import { ThemePage } from './settings/ThemePage';
import { AboutPage } from './settings/AboutPage';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState<'main' | 'audio' | 'notifications' | 'theme' | 'about'>('main');

  if (currentPage === 'audio') {
    return <AudioSettingsPage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'notifications') {
    return <NotificationsPage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'theme') {
    return <ThemePage onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'about') {
    return <AboutPage onBack={() => setCurrentPage('main')} />;
  }

  const settingsItems = [
    {
      icon: Volume2,
      label: 'Audio Settings',
      description: 'Voice and sound preferences',
      onClick: () => setCurrentPage('audio')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your notifications',
      onClick: () => setCurrentPage('notifications')
    },
    {
      icon: Palette,
      label: 'Theme',
      description: 'Customize appearance',
      onClick: () => setCurrentPage('theme')
    },
    {
      icon: Info,
      label: 'About',
      description: 'App version and info',
      onClick: () => setCurrentPage('about')
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
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        <div className="space-y-3">
          {settingsItems.map((item, index) => {
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

        <GlassCard variant="strong" className="mt-8">
          <GlassCardContent className="p-4 text-center text-sm text-muted-foreground">
            <p>SnapRoast v1.0.0</p>
            <p>Made with ❤️ for Gen Z</p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};