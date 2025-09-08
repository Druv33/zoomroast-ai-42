import React from 'react';
import { ArrowLeft, Info, Heart, Github, Mail, Star } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
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
              <Info className="w-5 h-5 mr-2" />
              About SnapRoast
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        <div className="space-y-4">
          {/* App Info */}
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-bold text-lg mb-2">SnapRoast</h3>
              <p className="text-muted-foreground text-sm mb-4">
                AI-powered roast generator for Gen-Z humor
              </p>
              <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                Version 1.0.0
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Features */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <h4 className="font-semibold mb-3">Features</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  AI-powered roast generation
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Hindi transliteration support
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Text-to-speech with Google Gemini
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Image analysis with Google Gemini
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Support */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-3">
                <GlassButton variant="ghost" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </GlassButton>
                <GlassButton variant="ghost" className="w-full justify-start">
                  <Github className="w-4 h-4 mr-2" />
                  Report Issues
                </GlassButton>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Credits */}
          <GlassCard variant="strong">
            <GlassCardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-muted-foreground mr-1">Made with</span>
                <Heart className="w-4 h-4 text-red-500 mx-1" />
                <span className="text-sm text-muted-foreground ml-1">for Gen Z</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Powered by Dhruv
              </p>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};