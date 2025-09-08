import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface TermsConditionsPageProps {
  onBack: () => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onBack }) => {
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
              <FileText className="w-5 h-5 mr-2 text-neon-primary" />
              <GlassCardTitle>Terms & Conditions</GlassCardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </GlassCardHeader>
          <GlassCardContent className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By using SnapRoast, you agree to these Terms & Conditions. 
                If you disagree with any part, please do not use our service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
              <p className="text-muted-foreground">
                You must be at least 13 years old to use SnapRoast. Users under 18 
                require parental consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Acceptable Use</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Do not upload illegal, harmful, or inappropriate content</li>
                <li>• Respect others' privacy and dignity</li>
                <li>• No harassment, bullying, or hate speech</li>
                <li>• Do not attempt to hack or disrupt the service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Generated Content</h3>
              <p className="text-muted-foreground">
                AI-generated roasts are for entertainment only. We are not responsible 
                for the accuracy, appropriateness, or consequences of generated content.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Subscription Terms</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Free users get 1 roast trial</li>
                <li>• Premium plan: 49 roasts per month for $5</li>
                <li>• Monthly billing, cancel anytime</li>
                <li>• No refunds for partial usage</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Intellectual Property</h3>
              <p className="text-muted-foreground">
                You retain ownership of uploaded content. By uploading, you grant us 
                a temporary license to process content for service delivery.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
              <p className="text-muted-foreground">
                SnapRoast is provided "as is". We are not liable for damages, losses, 
                or disputes arising from use of our platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Contact</h3>
              <p className="text-muted-foreground">
                Questions about these terms? Contact{' '}
                <a href="mailto:rr3084202@gmail.com" className="text-neon-primary hover:underline">
                  rr3084202@gmail.com
                </a>
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
};