import React from 'react';
import { X, Crown, Zap } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      
      <GlassCard variant="elevated" className="relative w-full max-w-md animate-bounce-in">
        <GlassCardHeader className="text-center pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass-surface flex items-center justify-center glass-hover"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center mb-4 neon-glow-strong">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <GlassCardTitle>Premium Required</GlassCardTitle>
          <p className="text-muted-foreground text-sm">
            Upgrade to Premium to generate unlimited roasts with HD quality and custom styles
          </p>
        </GlassCardHeader>
        
        <GlassCardContent className="space-y-4">
          <div className="glass-surface rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-neon-primary mb-1">$3</div>
            <div className="text-sm text-muted-foreground">per month</div>
            <div className="text-xs text-neon-secondary mt-1">or $30/year (save 16%)</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-foreground">
              <Zap className="w-4 h-4 text-neon-tertiary mr-2" />
              Unlimited roast generations
            </div>
            <div className="flex items-center text-foreground">
              <Zap className="w-4 h-4 text-neon-tertiary mr-2" />
              HD downloads & custom styles
            </div>
            <div className="flex items-center text-foreground">
              <Zap className="w-4 h-4 text-neon-tertiary mr-2" />
              Early access to new features
            </div>
          </div>
          
          <GlassButton
            variant="premium"
            size="lg"
            onClick={onSubscribe}
            className="w-full"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </GlassButton>
          
          <p className="text-xs text-muted-foreground text-center">
            Cancel anytime. No hidden fees.
          </p>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};