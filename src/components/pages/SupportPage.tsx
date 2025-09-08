import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Book, Bug, Shield, FileText, Info } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { PrivacyPolicyPage } from './settings/PrivacyPolicyPage';
import { TermsConditionsPage } from './settings/TermsConditionsPage';
import { SafetyGuidelinesPage } from './settings/SafetyGuidelinesPage';

interface SupportPageProps {
  onBack: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'main' | 'privacy' | 'terms' | 'safety'>('main');

  if (currentView === 'privacy') {
    return <PrivacyPolicyPage onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'terms') {
    return <TermsConditionsPage onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'safety') {
    return <SafetyGuidelinesPage onBack={() => setCurrentView('main')} />;
  }
  const supportItems = [
    {
      icon: Mail,
      label: 'Contact Support',
      description: 'Get help from our team',
      onClick: () => window.open('mailto:rr3084202@gmail.com', '_blank')
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      description: 'Chat with us in real-time',
      onClick: () => window.open('https://wa.me/+919876543210?text=Hello! I need help with SnapRoast app.', '_blank')
    },
    {
      icon: Book,
      label: 'Help Center',
      description: 'Browse FAQs and guides',
      onClick: () => window.open('https://www.notion.so/SnapRoast-Help-Center-12345', '_blank')
    },
    {
      icon: Bug,
      label: 'Report a Bug',
      description: 'Help us improve the app',
      onClick: () => window.open('mailto:rr3084202@gmail.com?subject=Bug Report', '_blank')
    }
  ];

  const legalItems = [
    {
      icon: Shield,
      label: 'Privacy Policy',
      description: 'How we protect your data',
      onClick: () => setCurrentView('privacy')
    },
    {
      icon: FileText,
      label: 'Terms & Conditions',
      description: 'App usage terms',
      onClick: () => setCurrentView('terms')
    },
    {
      icon: Info,
      label: 'Safety Guidelines',
      description: 'Community safety rules',
      onClick: () => setCurrentView('safety')
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
              <HelpCircle className="w-5 h-5 mr-2" />
              Support & Help
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-sm text-muted-foreground">
              Need help? We're here for you! Choose from the options below to get assistance.
            </p>
          </GlassCardContent>
        </GlassCard>

        <div className="space-y-3">
          {supportItems.map((item, index) => {
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

        {/* Legal Pages */}
        <GlassCard variant="elevated" className="mt-8">
          <GlassCardHeader>
            <h3 className="font-semibold text-foreground">Legal & Safety</h3>
          </GlassCardHeader>
          <GlassCardContent className="space-y-3">
            {legalItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <GlassButton
                  key={index}
                  variant="ghost"
                  onClick={item.onClick}
                  className="w-full justify-start h-auto p-3 glass-surface hover:glass-strong"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg glass-surface flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                </GlassButton>
              );
            })}
          </GlassCardContent>
        </GlassCard>

        <GlassCard variant="strong" className="mt-6">
          <GlassCardContent className="p-4 text-center">
            <h3 className="font-semibold text-foreground mb-2">Quick Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Make sure you're signed in to use all features</li>
              <li>• Upload clear, well-lit photos for best results</li>
              <li>• Try different photos for varied roast styles</li>
            </ul>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};