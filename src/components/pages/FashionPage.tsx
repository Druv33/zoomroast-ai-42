import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, Sparkles } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { CameraModal } from '@/components/ui/camera-modal';
import { useToast } from '@/hooks/use-toast';

interface FashionPageProps {
  onBack: () => void;
}

export const FashionPage: React.FC<FashionPageProps> = ({ onBack }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraFor, setCameraFor] = useState<'user' | 'clothing'>('user');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const userFileRef = useRef<HTMLInputElement>(null);
  const clothingFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File, type: 'user' | 'clothing') => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        if (type === 'user') {
          setUserImage(imageData);
        } else {
          setClothingImage(imageData);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
    }
  };

  const handleCameraCapture = (imageData: string) => {
    if (cameraFor === 'user') {
      setUserImage(imageData);
    } else {
      setClothingImage(imageData);
    }
    setShowCameraModal(false);
  };

  const handleTryOn = async () => {
    if (!userImage || !clothingImage) {
      toast({
        title: "Missing images",
        description: "Please upload both your photo and the clothing item",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll use one of the input images as result
      setResult(userImage);
      
      toast({
        title: "Try-on complete!",
        description: "Here's how the outfit looks on you",
      });
    } catch (error) {
      toast({
        title: "Try-on failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 px-6 py-8 pb-32 mt-20">
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
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              Fashion AI Try-On
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Upload your photo and a clothing item to see how it looks on you
            </p>

            {/* User Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your Photo</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-4">
                {userImage ? (
                  <img src={userImage} alt="User" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Upload your photo</p>
                  </div>
                )}
                <div className="flex space-x-2 mt-3">
                  <GlassButton 
                    size="sm" 
                    onClick={() => userFileRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </GlassButton>
                  <GlassButton 
                    size="sm" 
                    onClick={() => {
                      setCameraFor('user');
                      setShowCameraModal(true);
                    }}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </GlassButton>
                </div>
              </div>
            </div>

            {/* Clothing Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Clothing Item</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-4">
                {clothingImage ? (
                  <img src={clothingImage} alt="Clothing" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Upload clothing item</p>
                  </div>
                )}
                <div className="flex space-x-2 mt-3">
                  <GlassButton 
                    size="sm" 
                    onClick={() => clothingFileRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </GlassButton>
                  <GlassButton 
                    size="sm" 
                    onClick={() => {
                      setCameraFor('clothing');
                      setShowCameraModal(true);
                    }}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </GlassButton>
                </div>
              </div>
            </div>

            {/* Try On Button */}
            <GlassButton
              variant="primary"
              className="w-full"
              onClick={handleTryOn}
              disabled={!userImage || !clothingImage || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try On Outfit
                </>
              )}
            </GlassButton>
          </GlassCardContent>
        </GlassCard>

        {/* Result */}
        {result && (
          <GlassCard variant="elevated">
            <GlassCardHeader>
              <GlassCardTitle>Your Virtual Try-On</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="p-6">
              <img src={result} alt="Try-on result" className="w-full rounded-lg" />
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Hidden file inputs */}
        <input
          ref={userFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'user')}
        />
        <input
          ref={clothingFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'clothing')}
        />

        {/* Camera Modal */}
        <CameraModal
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onCapture={handleCameraCapture}
        />
      </div>
    </div>
  );
};