import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCaptionOverlayProps {
  imageUrl: string;
  roastLines?: string[];
  audioData?: string[];
  captionsData?: any;
  onTextToSpeech?: (text: string, isFirstLine?: boolean) => Promise<{ duration: number; audioElement?: HTMLAudioElement }>;
  className?: string;
}

export const ImageCaptionOverlay: React.FC<ImageCaptionOverlayProps> = ({
  imageUrl,
  roastLines = [],
  audioData = [],
  captionsData,
  onTextToSpeech,
  className
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Auto-advance through lines with typing effect
  useEffect(() => {
    if (!roastLines.length || isPlaying) return;

    const currentLine = roastLines[currentLineIndex] || '';
    if (displayedText.length < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentLine.slice(0, displayedText.length + 1));
      }, 50); // Typing speed
      return () => clearTimeout(timer);
    } else {
      // Move to next line after completing current line
      const nextTimer = setTimeout(() => {
        if (currentLineIndex < roastLines.length - 1) {
          setCurrentLineIndex(currentLineIndex + 1);
          setDisplayedText('');
        }
      }, 2000); // Pause before next line
      return () => clearTimeout(nextTimer);
    }
  }, [displayedText, currentLineIndex, roastLines, isPlaying]);

  // Reset when roast lines change
  useEffect(() => {
    setCurrentLineIndex(0);
    setDisplayedText('');
    setCurrentWordIndex(0);
    setIsPlaying(false);
  }, [roastLines]);

  const handlePlayAudio = async () => {
    if (!onTextToSpeech || !roastLines.length) return;

    setIsPlaying(true);
    
    try {
      for (let i = 0; i < roastLines.length; i++) {
        setCurrentLineIndex(i);
        setDisplayedText(''); // Clear text first
        
        // Play audio for current line and get actual duration
        const result = await onTextToSpeech(roastLines[i], i === 0);
        console.log(`Caption overlay: Line ${i + 1} duration:`, result.duration, 'ms');
        
        // Animate text display synchronized with audio
        const line = roastLines[i];
        const words = line.split(' ');
        const timePerWord = result.duration / words.length;
        
        // Display words in sync with audio
        for (let j = 0; j < words.length; j++) {
          if (!isPlaying) break;
          
          const wordsToShow = words.slice(0, j + 1).join(' ');
          setDisplayedText(wordsToShow);
          
          if (j < words.length - 1) {
            await new Promise(resolve => setTimeout(resolve, timePerWord));
          }
        }
        
        // Ensure full text is displayed
        setDisplayedText(line);
        
        // Wait before next line
        if (i < roastLines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      handlePlayAudio();
    }
  };

  const navigateToLine = (index: number) => {
    if (isPlaying) return; // Don't allow navigation during playback
    setCurrentLineIndex(index);
    setDisplayedText('');
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Background Image - Only show if roastLines exist, otherwise let parent handle image display */}
      {roastLines.length === 0 && (
        <img 
          src={imageUrl} 
          alt="Uploaded image" 
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Dark overlay for better text contrast - only when showing captions */}
      {roastLines.length > 0 && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      )}
      
      {/* Caption Overlay */}
      {roastLines.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          {/* Current line with enhanced styling */}
          <div className="glass-strong rounded-xl p-4 backdrop-blur-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-primary animate-pulse" />
              <span className="text-xs font-medium text-neon-primary uppercase tracking-wider">
                Line {currentLineIndex + 1} of {roastLines.length}
              </span>
            </div>
            
            <p className="roast-text text-lg sm:text-xl text-foreground leading-tight">
              {displayedText}
              {displayedText.length < (roastLines[currentLineIndex]?.length || 0) && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>
          
          {/* Audio Control */}
          {onTextToSpeech && (
            <div className="flex justify-center">
              <button
                onClick={togglePlayback}
                disabled={!roastLines.length}
                className="glass-surface rounded-full p-3 hover:glass-hover transition-all duration-300 neon-glow"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-neon-primary" />
                ) : (
                  <Play className="w-5 h-5 text-neon-primary ml-0.5" />
                )}
              </button>
            </div>
          )}
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2">
            {roastLines.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToLine(index)}
                disabled={isPlaying}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110",
                  "disabled:cursor-not-allowed disabled:hover:scale-100",
                  index === currentLineIndex
                    ? "bg-neon-primary scale-125"
                    : index < currentLineIndex
                    ? "bg-neon-primary/60 hover:bg-neon-primary/80"
                    : "bg-glass-border hover:bg-glass-border/80"
                )}
                aria-label={`Go to line ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};