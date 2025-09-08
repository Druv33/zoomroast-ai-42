import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, BellOff, Zap, Star, Gift } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface NotificationsPageProps {
  onBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [roastCompleted, setRoastCompleted] = useState(true);
  const [newFeatures, setNewFeatures] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedPush = localStorage.getItem('pushNotifications');
    const savedRoast = localStorage.getItem('roastCompleted');
    const savedFeatures = localStorage.getItem('newFeatures');
    const savedPromotions = localStorage.getItem('promotions');

    if (savedPush) setPushNotifications(savedPush === 'true');
    if (savedRoast) setRoastCompleted(savedRoast === 'true');
    if (savedFeatures) setNewFeatures(savedFeatures === 'true');
    if (savedPromotions) setPromotions(savedPromotions === 'true');
  }, []);

  const handlePushToggle = (enabled: boolean) => {
    setPushNotifications(enabled);
    localStorage.setItem('pushNotifications', enabled.toString());
    
    toast({
      title: enabled ? "🔔 Notifications enabled" : "🔕 Notifications disabled",
      description: enabled 
        ? "You'll receive notifications for uploads and completed roasts"
        : "All notifications have been turned off",
    });
  };

  const handleRoastToggle = (enabled: boolean) => {
    setRoastCompleted(enabled);
    localStorage.setItem('roastCompleted', enabled.toString());
  };

  const handleFeaturesToggle = (enabled: boolean) => {
    setNewFeatures(enabled);
    localStorage.setItem('newFeatures', enabled.toString());
  };

  const handlePromotionsToggle = (enabled: boolean) => {
    setPromotions(enabled);
    localStorage.setItem('promotions', enabled.toString());
  };

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
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        <div className="space-y-4">
          {/* Push Notifications */}
          <GlassCard variant="elevated">
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {pushNotifications ? (
                    <div className="w-10 h-10 rounded-full bg-neon-primary/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-neon-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                      <BellOff className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      {pushNotifications ? 'All notifications enabled' : 'Notifications disabled'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={handlePushToggle}
                />
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Roast Completed */}
          <GlassCard className={!pushNotifications ? 'opacity-60' : ''}>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    roastCompleted && pushNotifications 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Roast Completed</div>
                    <div className="text-sm text-muted-foreground">Get notified when your roast is ready</div>
                  </div>
                </div>
                <Switch
                  checked={roastCompleted}
                  onCheckedChange={handleRoastToggle}
                  disabled={!pushNotifications}
                />
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* New Features */}
          <GlassCard className={!pushNotifications ? 'opacity-60' : ''}>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    newFeatures && pushNotifications 
                      ? 'bg-blue-500/20 text-blue-500' 
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">New Features</div>
                    <div className="text-sm text-muted-foreground">Get notified about exciting updates</div>
                  </div>
                </div>
                <Switch
                  checked={newFeatures}
                  onCheckedChange={handleFeaturesToggle}
                  disabled={!pushNotifications}
                />
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Promotions */}
          <GlassCard className={!pushNotifications ? 'opacity-60' : ''}>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    promotions && pushNotifications 
                      ? 'bg-purple-500/20 text-purple-500' 
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Promotions & Offers</div>
                    <div className="text-sm text-muted-foreground">Special deals and exclusive discounts</div>
                  </div>
                </div>
                <Switch
                  checked={promotions}
                  onCheckedChange={handlePromotionsToggle}
                  disabled={!pushNotifications}
                />
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};