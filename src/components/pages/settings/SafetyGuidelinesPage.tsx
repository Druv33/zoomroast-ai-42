import React from 'react';
import { ArrowLeft, Info, Heart, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface SafetyGuidelinesPageProps {
  onBack: () => void;
}

export const SafetyGuidelinesPage: React.FC<SafetyGuidelinesPageProps> = ({ onBack }) => {
  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <GlassButton variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </GlassButton>
        </div>

        <GlassCard variant="elevated">
          <GlassCardHeader>
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-neon-primary" />
              <GlassCardTitle>Safety Guidelines</GlassCardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Creating a safe space for everyone
            </p>
          </GlassCardHeader>
          <GlassCardContent className="space-y-6 text-sm">
            <div className="bg-neon-primary/10 border border-neon-primary/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Heart className="w-4 h-4 mr-2 text-neon-primary" />
                <h3 className="font-semibold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground">
                SnapRoast generates fun, light-hearted content. We want everyone 
                to laugh together, not at each other's expense.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Content Guidelines</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Only fun, playful, and non-offensive roasts</li>
                <li>• GenZ humor with memes and light teasing</li>
                <li>• No harassment, hate speech, or bullying</li>
                <li>• No sexual, political, or violent content</li>
                <li>• Respect for all individuals and communities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What We Don't Allow</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Discriminatory content based on race, gender, religion</li>
                <li>• Body shaming or personal attacks</li>
                <li>• Explicit or inappropriate imagery</li>
                <li>• Copyrighted content without permission</li>
                <li>• Spam or misleading information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">AI Safety Features</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Automatic content filtering</li>
                <li>• Fallback response for inappropriate requests</li>
                <li>• Regular model updates for safety</li>
                <li>• Human review of reported content</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                <h3 className="font-semibold text-foreground">Inappropriate Content Response</h3>
              </div>
              <p className="text-muted-foreground">
                If you try to generate inappropriate content, you'll see: 
                <span className="font-medium">"Nice try, but we roast only with love ❤️"</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Reporting Issues</h3>
              <p className="text-muted-foreground">
                Found something inappropriate? Report it to us immediately at{' '}
                <a href="mailto:rr3084202@gmail.com" className="text-neon-primary hover:underline">
                  rr3084202@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Community Standards</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Be kind and respectful to all users</li>
                <li>• Use generated content responsibly</li>
                <li>• Don't share roasts to hurt or embarrass others</li>
                <li>• Report violations to keep our community safe</li>
              </ul>
            </div>

            <div className="bg-neon-secondary/10 border border-neon-secondary/30 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">
                <strong>Remember:</strong> SnapRoast is meant for fun! 
                Let's keep it positive and entertaining for everyone. ✨
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};