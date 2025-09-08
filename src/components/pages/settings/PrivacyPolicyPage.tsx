import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
              <Shield className="w-5 h-5 mr-2 text-neon-primary" />
              <GlassCardTitle>Privacy Policy</GlassCardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </GlassCardHeader>
          <GlassCardContent className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Account information (name, email, profile photo)</li>
                <li>• Uploaded images for roast generation</li>
                <li>• Device information and usage analytics</li>
                <li>• Generated content and preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• To provide and improve our roast generation service</li>
                <li>• To personalize your experience</li>
                <li>• To ensure app safety and prevent abuse</li>
                <li>• For customer support and communications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
              <p className="text-muted-foreground">
                We use industry-standard encryption and security measures to protect your data. 
                Uploaded images are automatically deleted after processing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Data Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell or share your personal data with third parties except as required 
                by law or to provide our services (AI processing, authentication).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Access and update your information</li>
                <li>• Delete your account and data</li>
                <li>• Opt out of data processing</li>
                <li>• Data portability</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
              <p className="text-muted-foreground">
                For privacy concerns, contact us at{' '}
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