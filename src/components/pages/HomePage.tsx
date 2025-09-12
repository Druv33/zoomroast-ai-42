import React, { useState } from 'react';
import { Palette, Heart, Home as HomeIcon, ArrowRight, Upload, Camera } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useToast } from '@/hooks/use-toast';
import { CameraModal } from '@/components/ui/camera-modal';

interface HomePageProps {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  onAuthRequired: () => void;
  onSubscriptionRequired: () => void;
  profile?: any;
  onProfileRefresh?: () => void;
  onFeatureSelect: (feature: 'fashion' | 'beauty' | 'home-decor') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated,
  isSubscribed,
  onAuthRequired,
  onSubscriptionRequired,
  onFeatureSelect
}) => {
  const { toast } = useToast();

  const features = [
    {
      id: 'fashion' as const,
      title: 'Fashion',
      description: 'Try on clothes virtually with AI',
      icon: Palette,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400'
    },
    {
      id: 'beauty' as const,
      title: 'Beauty',
      description: 'Virtual makeup and skincare try-on',
      icon: Heart,
      gradient: 'from-pink-500/20 to-red-500/20',
      iconColor: 'text-pink-400'
    },
    {
      id: 'home-decor' as const,
      title: 'Home Decor',
      description: 'Design and visualize your space',
      icon: HomeIcon,
      gradient: 'from-blue-500/20 to-green-500/20',
      iconColor: 'text-blue-400'
    }
  ];

  const handleFeatureClick = (featureId: 'fashion' | 'beauty' | 'home-decor') => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to access AI features",
        variant: "destructive"
      });
      onAuthRequired();
      return;
    }

    onFeatureSelect(featureId);
  };

  return (
    <div className="flex-1 px-6 py-8 pb-32 mt-20">
      <div className="max-w-md mx-auto">
        
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Transform Your Style
          </h2>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? "Choose a feature to get started with AI-powered styling"
              : "Login to unlock AI-powered fashion, beauty, and home design features"
            }
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <GlassCard
                key={feature.id}
                variant="elevated"
                className={`cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br ${feature.gradient} border-white/10 stagger-in opacity-0`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <GlassCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-black/20 ${feature.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </GlassCardContent>
              </GlassCard>
            );
          })}
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <GlassButton 
              variant="primary" 
              className="w-full"
              onClick={onAuthRequired}
            >
              Get Started - Login with Google
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );
};