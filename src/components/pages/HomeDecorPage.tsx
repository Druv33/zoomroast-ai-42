import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, Home as HomeIcon, MessageSquare } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { CameraModal } from '@/components/ui/camera-modal';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface HomeDecorPageProps {
  onBack: () => void;
}

export const HomeDecorPage: React.FC<HomeDecorPageProps> = ({ onBack }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target?.result as string);
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
    setRoomImage(imageData);
    setShowCameraModal(false);
  };

  const handleDesign = async () => {
    if (!roomImage || !prompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a room photo and describe what you'd like to add or change",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // For demo purposes, we'll use the input image as result
      setResult(roomImage);
      
      toast({
        title: "Design complete!",
        description: "Here's your redesigned space",
      });
    } catch (error) {
      toast({
        title: "Design failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const promptSuggestions = [
    "Add a modern sofa and coffee table",
    "Include plants and natural lighting",
    "Add minimalist furniture",
    "Create a cozy reading corner",
    "Add colorful artwork and decorations"
  ];

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
              <HomeIcon className="w-5 h-5 mr-2 text-blue-400" />
              Home Decor AI
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Upload your room photo and describe what you'd like to add or change
            </p>

            {/* Room Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Room Photo</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-4">
                {roomImage ? (
                  <img src={roomImage} alt="Room" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Upload your room photo</p>
                  </div>
                )}
                <div className="flex space-x-2 mt-3">
                  <GlassButton 
                    size="sm" 
                    onClick={() => fileRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </GlassButton>
                  <GlassButton 
                    size="sm" 
                    onClick={() => setShowCameraModal(true)}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </GlassButton>
                </div>
              </div>
            </div>

            {/* Design Prompt */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">What would you like to add or change?</h3>
              <div className="space-y-3">
                <Input
                  placeholder="e.g., Add a modern sofa and coffee table..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="glass-surface border-white/10"
                />
                
                {/* Prompt Suggestions */}
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                  {promptSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs text-left p-2 rounded-lg glass-surface hover:bg-white/5 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Design Button */}
            <GlassButton
              variant="primary"
              className="w-full"
              onClick={handleDesign}
              disabled={!roomImage || !prompt.trim() || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Designing...
                </div>
              ) : (
                <>
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Generate Design
                </>
              )}
            </GlassButton>
          </GlassCardContent>
        </GlassCard>

        {/* Result */}
        {result && (
          <GlassCard variant="elevated">
            <GlassCardHeader>
              <GlassCardTitle>Your Redesigned Space</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="p-6">
              <img src={result} alt="Redesigned room" className="w-full rounded-lg mb-3" />
              <p className="text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                "{prompt}"
              </p>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
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