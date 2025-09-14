import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Zap, Volume2, Download } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CameraModal } from '@/components/ui/camera-modal';
import { ImageViewer } from '@/components/ui/image-viewer';

interface HomePageProps {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  onAuthRequired: () => void;
  onSubscriptionRequired: () => void;
  profile?: {
    forms_generated?: number;
  };
  onProfileRefresh?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isAuthenticated,
  isSubscribed,
  onAuthRequired,
  onSubscriptionRequired,
  profile,
  onProfileRefresh
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [formData, setFormData] = useState<{lines: string[], audioData: string[], captions?: any} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        // Clear previous form data when new image is uploaded
        setFormData(null);
        
        // Show upload notification if enabled
        const pushNotifications = localStorage.getItem('pushNotifications');
        if (pushNotifications === null || pushNotifications === 'true') {
          toast({
            title: 'Image uploaded successfully!',
            description: 'Your form is ready for analysis. Hit Generate to create your form guide!',
          });
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleCameraCapture = () => {
    setShowCameraModal(true);
  };

  const handleCameraPhotoCapture = (imageData: string) => {
    setSelectedImage(imageData);
    // Clear previous form data when new image is captured
    setFormData(null);
    setShowCameraModal(false);
    
    // Show upload notification if enabled
    const pushNotifications = localStorage.getItem('pushNotifications');
    if (pushNotifications === null || pushNotifications === 'true') {
        toast({
          title: 'Image uploaded successfully!',
          description: 'Your form is ready for analysis. Hit Generate to create your form guide!',
        });
    }
  };

  const handleTextToSpeech = async (text: string, isFirstLine = false): Promise<{ duration: number; audioElement?: HTMLAudioElement }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to use text-to-speech');
      }

      // Add appropriate intro text for English only
        const introText = isFirstLine 
          ? "Let me guide you through filling this form! Here we go... "
          : "";
        const fullText = introText + text;
      
      console.log('TTS Text:', { isFirstLine, introText, text, fullText });
      
      const response = await supabase.functions.invoke('generate-tts', {
        body: { 
          text: fullText, 
          voice: 'male',
          language: 'english'
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { audioBase64, success, useBuiltInTTS, duration } = response.data;
      
      // Check if we should use browser fallback
      if (useBuiltInTTS) {
        console.log('Using browser TTS fallback for:', fullText);
        return new Promise((resolve) => {
          const utterance = new SpeechSynthesisUtterance(fullText);
          utterance.lang = 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          
          // Calculate estimated duration for browser TTS
          const estimatedDuration = Math.max(2000, fullText.length * 100); // 100ms per character
          console.log('Browser TTS estimated duration:', estimatedDuration, 'ms');
          
          utterance.onend = () => resolve({ duration: estimatedDuration });
          utterance.onerror = () => resolve({ duration: estimatedDuration });
          
          speechSynthesis.speak(utterance);
        });
      }
      
      if (success && audioBase64) {
        // Create audio element with base64 data from OpenAI TTS
        return new Promise((resolve, reject) => {
          const audioElement = new Audio(`data:audio/mp3;base64,${audioBase64}`);
          
          // Apply user volume settings
          const savedVolume = localStorage.getItem('audioVolume');
          audioElement.volume = savedVolume ? parseInt(savedVolume) / 100 : 0.8;
          
          // Wait for metadata to get actual duration
          audioElement.onloadedmetadata = () => {
            const actualDuration = audioElement.duration * 1000; // Convert to milliseconds
            console.log('Audio loaded, duration:', actualDuration, 'ms');
            
            audioElement.onended = () => {
              console.log('Audio playback completed');
              resolve({ duration: actualDuration, audioElement });
            };
            
            audioElement.onerror = (error) => {
              console.error('Audio playback error:', error);
            // Fallback to browser TTS
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
              const estimatedDuration = Math.max(2000, fullText.length * 100);
              utterance.onend = () => resolve({ duration: estimatedDuration });
              speechSynthesis.speak(utterance);
            };
            
            // Start playing
            audioElement.play().catch((playError) => {
              console.error('Play failed:', playError);
            // Fallback to browser TTS
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
              const estimatedDuration = Math.max(2000, fullText.length * 100);
              utterance.onend = () => resolve({ duration: estimatedDuration });
              speechSynthesis.speak(utterance);
            });
          };
          
          audioElement.onerror = () => {
            console.error('Audio loading failed, using browser fallback');
            // Fallback to browser TTS
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            const estimatedDuration = Math.max(2000, fullText.length * 100);
            utterance.onend = () => resolve({ duration: estimatedDuration });
            speechSynthesis.speak(utterance);
          };
        });
      } else {
        throw new Error('No audio data received from TTS service');
      }
    } catch (error: any) {
      console.error('Error playing TTS, using browser fallback:', error);
      // Always fallback to browser TTS if there's any error
      return new Promise((resolve) => {
        const introText = isFirstLine 
          ? "Alright, let's roast this one! Here we go... "
          : "";
        const fullText = introText + text;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        const estimatedDuration = Math.max(2000, fullText.length * 100);
        
        utterance.onend = () => resolve({ duration: estimatedDuration });
        utterance.onerror = () => {
          toast({
            title: "Audio playback failed", 
            description: "Speech synthesis unavailable.",
            variant: "destructive"
          });
          resolve({ duration: estimatedDuration });
        };
        
        speechSynthesis.speak(utterance);
      });
    }
  };

  const handleGenerateFormGuide = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    // Check if user has remaining credits (free trial gets 1 form guide)
    const formsGenerated = profile?.forms_generated || 0;
    if (!isSubscribed && formsGenerated >= 1) {
      toast({
        title: "Free trial limit reached",
        description: "You've used your free form guide. Upgrade to Premium for unlimited access!",
        variant: "destructive"
      });
      onSubscriptionRequired();
      return;
    }

    if (!selectedImage) return;

    setIsGenerating(true);
    
    try {
      // Verify authentication before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to generate form guides');
      }

      // Generate form guide directly with image

      // Clear previous form data to ensure fresh generation
      setFormData(null);
      
      // Add randomization for unique roasts each time
      const randomSeed = Math.random().toString(36).substring(7);
      const timestamp = Date.now();
      
      let formGuideResponse;
      try {
        console.log('Sending language to backend: english');
        formGuideResponse = await supabase.functions.invoke('generate-form-guide', {
          body: { 
            imageBase64: selectedImage,
            language: 'english',
            seed: randomSeed,
            timestamp: timestamp,
            requestId: `${timestamp}_${randomSeed}`
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        console.log('Form guide response:', formGuideResponse);

        if (formGuideResponse.error) {
          console.error('Form guide generation error:', formGuideResponse.error);
          throw new Error(`Form guide generation failed: ${formGuideResponse.error.message}`);
        }
      } catch (functionError: any) {
        console.error('Edge function invocation failed:', functionError);
        throw new Error(`Failed to send a request to the Edge Function: ${functionError.message || 'Network error'}`);
      }

      if (!formGuideResponse.data?.success) {
        throw new Error(formGuideResponse.data?.error || 'Failed to generate form guide');
      }

      const { formGuide, imageUrl, captions } = formGuideResponse.data;

      if (!formGuide?.lines || formGuide.lines.length === 0) {
        throw new Error('No form guide generated. Please try again.');
      }

      // Step 3: Generate TTS for each line using Google Gemini TTS

      let audioData: string[] = [];
      try {
        const audioPromises = formGuide.lines.map((line: string, index: number) => {
          // Alternate between male and female voices for variety
          const voice = index % 2 === 0 ? 'male' : 'female';
          
          return supabase.functions.invoke('generate-tts', {
            body: { text: line, voice: voice, language: 'english' },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        });

        const audioResponses = await Promise.all(audioPromises);
        audioData = audioResponses
          .map(r => r.data?.success ? r.data.audioBase64 : null)
          .filter(Boolean);

        console.log('Google TTS audio generation completed:', { 
          requested: formGuide.lines.length, 
          generated: audioData.length 
        });
      } catch (audioError) {
        console.error('Google TTS audio generation failed, showing form guide without audio:', audioError);
        // Continue without audio - don't block the form guide display
      }

      // Save form guide to history
      try {
        const { error: saveError } = await supabase
          .from('roasts')
          .insert({
            roast_lines: formGuide.lines,
            image_url: imageUrl,
            status: 'completed',
            user_id: session.user.id
          });

        if (saveError) {
          console.error('Error saving form guide to history:', saveError);
        }
      } catch (saveError) {
        console.error('Error saving form guide to history:', saveError);
      }

      // Don't add intro text here - it's handled in TTS

      // Always show the form guide, even if audio generation fails
      setFormData({
        lines: formGuide.lines,
        audioData: audioData,
        captions: captions
      });

      // Show form guide completed notification if enabled
      const pushNotifications = localStorage.getItem('pushNotifications');
      const formCompleted = localStorage.getItem('formCompleted');
      if ((pushNotifications === null || pushNotifications === 'true') && 
          (formCompleted === null || formCompleted === 'true')) {
        toast({
          title: 'Your form guide is ready!',
          description: 'Generated helpful form guidance! Ready to help you fill it out!',
        });
      }

      // Check if auto-play is enabled
      const autoPlay = localStorage.getItem('autoPlay');
      const shouldAutoPlay = autoPlay === null || autoPlay === 'true'; // Default to true

      if (formGuide.lines && shouldAutoPlay) {
        console.log('Auto-playing form guide with Google TTS');
        
        // Add delay before starting auto-play
        setTimeout(async () => {
          for (let i = 0; i < formGuide.lines.length; i++) {
            const line = formGuide.lines[i];
            console.log(`Auto-playing form guide line ${i + 1}:`, line);
            
            try {
              await handleTextToSpeech(line, i === 0);
              // Add delay between lines for dramatic effect
              if (i < formGuide.lines.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2500));
              }
            } catch (ttsError) {
              console.error(`Google TTS failed for line ${i + 1}:`, ttsError);
              // Continue with next line even if current fails
            }
          }
        }, 1000);
      }

      // Refresh profile to update credits count
      if (onProfileRefresh) {
        onProfileRefresh();
      }

    } catch (error: any) {
      console.error('Error generating roast:', error);
      
      // More specific error messages
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.message?.includes('subscription')) {
        errorMessage = 'Please subscribe to generate roasts';
        onSubscriptionRequired();
      } else if (error.message?.includes('authentication')) {
        errorMessage = 'Please log in to continue';
        onAuthRequired(); 
      } else if (error.message?.includes('API key')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.message?.includes('No features detected')) {
        errorMessage = 'No features detected. Try a clearer photo with your face visible.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "🚫 Form Guide Failed!",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadFormGuide = () => {
    if (!selectedImage || !formData) return;
    
    // Create canvas to combine image and captions
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Add caption overlay
      if (formData.lines && formData.lines.length > 0) {
        const fontSize = Math.max(20, img.width / 25);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        
        // Add captions at bottom
        const startY = img.height - (formData.lines.length * fontSize * 1.2) - 20;
        formData.lines.forEach((line, index) => {
          const y = startY + (index * fontSize * 1.2);
          ctx.strokeText(line, img.width / 2, y);
          ctx.fillText(line, img.width / 2, y);
        });
      }
      
      // Download the canvas as image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `roasted-image-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Download Complete! ✅",
            description: "Your roasted image with captions has been saved to your device.",
          });
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.src = selectedImage;
  };

  return (
    <div className="flex-1 px-6 py-8 pb-32">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Upload Area */}
        <GlassCard variant="strong" className="overflow-hidden">
          <GlassCardContent className="p-0">
            <div
              className={`aspect-[9/16] relative transition-all duration-300 ${
                isDragOver ? 'bg-neon-primary/10 border-neon-primary' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedImage ? (
                <ImageViewer
                  src={selectedImage}
                  alt="Selected photo"
                  roastLines={formData?.lines}
                  audioData={formData?.audioData}
                  captionsData={formData?.captions}
                  onTextToSpeech={handleTextToSpeech}
                  onRemove={() => {
                    // Stop any ongoing speech synthesis
                    if (window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                    }
                    setSelectedImage(null);
                    setFormData(null);
                  }}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-xl glass-surface flex items-center justify-center mb-4 neon-glow">
                    <ImageIcon className="w-8 h-8 text-neon-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Upload your form
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drop a form image here or tap to browse
                  </p>
                  
                  {/* Upload and Camera Buttons Inside the Box */}
                  <div className="w-full space-y-4">
                    <GlassButton
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center justify-center space-x-3"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Form</span>
                    </GlassButton>
                    
                    <GlassButton
                      onClick={handleCameraCapture}
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center space-x-3"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Take Photo of Form</span>
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          </GlassCardContent>
        </GlassCard>


        {/* Generate Button */}
        <GlassButton
          variant={selectedImage ? "premium" : "default"}
          size="xl"
          onClick={handleGenerateFormGuide}
          disabled={!selectedImage || isGenerating}
          className="w-full relative overflow-hidden"
        >
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span className="font-semibold">
              {isGenerating ? 'Generating...' : 'Generate Form Guide'}
            </span>
          </div>
          {isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </GlassButton>

        {/* Download Button - Only show if form guide is generated */}
        {formData && (
          <GlassButton
            variant="secondary"
            size="lg"
            onClick={handleDownloadFormGuide}
            className="w-full flex items-center space-x-3"
          >
            <Download className="w-5 h-5" />
            <span className="font-semibold">Download Form Guide</span>
          </GlassButton>
        )}

        {!selectedImage && (
          <p className="text-center text-sm text-muted-foreground">
            Upload or snap to upload your form for AI guidance
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Camera Modal */}
        <CameraModal
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          onCapture={handleCameraPhotoCapture}
        />
      </div>
    </div>
  );
};