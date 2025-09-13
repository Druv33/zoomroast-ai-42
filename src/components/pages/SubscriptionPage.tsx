import React, { useState } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isSubscribed, subscribe, manageSubscription, profile } = useAuth();

  const getFeatures = (plan: 'monthly' | 'yearly') => [
    'Unlimited form explanations',
    'AI text + voice guide for form filling',
    'Real-time chat support',
    'Faster processing'
  ];

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      await subscribe(plan);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await manageSubscription();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive"
      });
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex-1 px-6 py-8 pb-32">
        <div className="max-w-md mx-auto">
          <GlassCard variant="elevated" className="text-center">
            <GlassCardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center mb-4 neon-glow-strong">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <GlassCardTitle className="text-neon-primary">Premium Active</GlassCardTitle>
              <p className="text-muted-foreground">
                You're all set with unlimited form explanations!
              </p>
            </GlassCardHeader>
            <GlassCardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-surface rounded-lg p-4">
                  <div className="text-2xl font-bold text-neon-primary">∞</div>
                  <div className="text-muted-foreground">Unlimited Forms</div>
                </div>
                <div className="glass-surface rounded-lg p-4">
                  <div className="text-2xl font-bold text-neon-secondary">HD</div>
                  <div className="text-muted-foreground">Quality</div>
                </div>
              </div>
              
              <GlassButton 
                variant="outline" 
                className="w-full"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center mb-4 neon-glow-strong">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Go Premium</h1>
          <p className="text-muted-foreground">
            Unlock unlimited form explanations and premium features
          </p>
        </div>

        {/* Plan Toggle */}
        <div className="glass-strong rounded-xl p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-lg text-center transition-all duration-300 ${
                selectedPlan === 'monthly'
                  ? 'glass-strong neon-glow text-neon-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="font-semibold">Monthly</div>
              <div className="text-2xl font-bold">$5</div>
              <div className="text-sm opacity-75">per month</div>
            </button>
            
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-lg text-center transition-all duration-300 relative ${
                selectedPlan === 'yearly'  
                  ? 'glass-strong neon-glow text-neon-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-neon-secondary text-white text-xs px-2 py-1 rounded-full">
                Save 16%
              </div>
              <div className="font-semibold">Yearly</div>
              <div className="text-2xl font-bold">$50</div>
              <div className="text-sm opacity-75">per year</div>
            </button>
          </div>
        </div>

        {/* Features */}
        <GlassCard variant="strong">
          <GlassCardContent className="p-6">
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-neon-primary mr-2" />
              <h3 className="font-semibold text-foreground">Premium Features</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {getFeatures(selectedPlan).map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-4 h-4 text-neon-tertiary mr-3 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Subscribe Button */}
        <GlassButton
          variant="premium"
          size="xl"
          onClick={() => handleSubscribe(selectedPlan)}
          disabled={isLoading}
          className="w-full relative overflow-hidden"
        >
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`} />
            <span className="font-semibold">
              {isLoading ? 'Processing...' : `Start Premium - ${selectedPlan === 'monthly' ? '$5/mo' : '$50/yr'}`}
            </span>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </GlassButton>

        <p className="text-center text-xs text-muted-foreground">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
};