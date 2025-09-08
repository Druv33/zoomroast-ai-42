import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Volume2, VolumeX, Play, Pause, X, Download } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ImageCaptionOverlay } from './image-caption-overlay';

interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

interface CaptionsData {
  words?: CaptionWord[];
  duration?: number;
}

interface ImageViewerProps {
  src: string;
  alt: string;
  roastLines?: string[];
  audioData?: string[];
  captionsData?: CaptionsData;
  onTextToSpeech?: (text: string, isFirstLine?: boolean) => Promise<{ duration: number; audioElement?: HTMLAudioElement }>;
  onRemove?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  roastLines = [],
  audioData = [],
  captionsData,
  onTextToSpeech,
  onRemove,
  onDownload,
  className = ""
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentlyDisplayedLine, setCurrentlyDisplayedLine] = useState<string>('');
  const [isSequentialPlaying, setIsSequentialPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isShowingWord, setIsShowingWord] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to get alternating word styling for TikTok/Instagram style
  const getWordStyling = (wordIndex: number) => {
    const styleIndex = wordIndex % 3;
    
    switch (styleIndex) {
      case 0:
        return 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
      case 1:
        return 'text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
      case 2:
        return 'text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
      default:
        return 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.3, 5)); // Allow more zoom
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.3, 0.3)); // Allow more zoom out
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition({
      x: dragStart.posX + deltaX,
      y: dragStart.posY + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const showWordsSequentially = async (text: string, actualDuration: number) => {
    const words = text.split(' ').filter(word => word.trim() !== '');
    setAllWords(words);
    setCurrentWordIndex(0);
    
    // Calculate precise timing based on actual audio duration
    const timePerWord = Math.max(200, actualDuration / words.length); // Use actual duration
    const startTime = Date.now();
    
    console.log(`Starting word animation: ${words.length} words over ${actualDuration}ms (${timePerWord}ms per word)`);
    
    for (let i = 0; i < words.length; i++) {
      if (!isSequentialPlaying) break;
      
      const expectedTime = startTime + (i * timePerWord);
      const currentTime = Date.now();
      const waitTime = Math.max(0, expectedTime - currentTime);
      
      // Wait for precise timing
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      if (isSequentialPlaying) {
        setCurrentWord(words[i]);
        setCurrentWordIndex(i);
        setIsShowingWord(true);
        
        // Calculate display duration (80% of word time for smooth transitions)
        const displayDuration = timePerWord * 0.8;
        
        // Hide word after display duration
        setTimeout(() => {
          if (isSequentialPlaying && i === currentWordIndex) {
            setIsShowingWord(false);
          }
        }, displayDuration);
      }
    }
    
    // Final cleanup after all words
    setTimeout(() => {
      setCurrentWord('');
      setIsShowingWord(false);
    }, timePerWord);
  };

  // Single word caption display with timing from captions API
  const playCaptionsWithTiming = async () => {
    if (!captionsData?.words || captionsData.words.length === 0) return;
    
    const startTime = Date.now();
    
    for (let i = 0; i < captionsData.words.length; i++) {
      if (!isSequentialPlaying) break;
      
      const wordData = captionsData.words[i];
      const elapsed = Date.now() - startTime;
      const wordStartMs = wordData.start * 1000;
      const wordEndMs = wordData.end * 1000;
      
      // Wait until it's time to show this word
      if (elapsed < wordStartMs) {
        await new Promise(resolve => setTimeout(resolve, wordStartMs - elapsed));
      }
      
      if (isSequentialPlaying) {
        setCurrentWord(wordData.word);
        setCurrentWordIndex(i);
        setIsShowingWord(true);
        
        // Hide word after its duration
        setTimeout(() => {
          if (isSequentialPlaying) {
            setIsShowingWord(false);
          }
        }, wordEndMs - wordStartMs);
      }
    }
    
    setCurrentWord('');
    setIsShowingWord(false);
  };

  const playAllRoastLines = async () => {
    if (!onTextToSpeech || roastLines.length === 0 || isMuted) return;
    
    setIsSequentialPlaying(true);
    setIsPlaying(true);
    setCurrentLineIndex(0);
    
    // First play Hindi intro
    const hindiIntro = "to guys ajj hamm esko roast karne wale hai to chaliye suru karte hai";
    try {
      console.log('Starting roast playback with intro');
      
      // Play intro and get actual duration
      const introResult = await onTextToSpeech(hindiIntro, true);
      console.log('Intro audio duration:', introResult.duration, 'ms');
      
      // Show intro words with precise timing
      const introWordsPromise = showWordsSequentially(hindiIntro, introResult.duration);
      
      // Wait for intro to complete
      await introWordsPromise;
      
      if (!isSequentialPlaying) return;
      
      // Pause after intro
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then play roast lines one by one with perfect sync
      for (let i = 0; i < roastLines.length; i++) {
        if (!isSequentialPlaying || isMuted) break;
        
        console.log(`Playing roast line ${i + 1}/${roastLines.length}: "${roastLines[i]}"`);
        setCurrentLineIndex(i);
        
        try {
          // Start TTS and get actual duration
          const speechResult = await onTextToSpeech(roastLines[i]);
          console.log(`Line ${i + 1} audio duration:`, speechResult.duration, 'ms');
          
          // Show words with precise timing synchronized to actual audio
          await showWordsSequentially(roastLines[i], speechResult.duration);
          
          // Short pause between lines for better flow
          if (i < roastLines.length - 1) {
            console.log('Pausing between lines...');
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } catch (error) {
          console.error(`Error playing TTS for line ${i + 1}:`, error);
          break;
        }
      }
      
      console.log('Roast playback completed successfully');
    } catch (error) {
      console.error('Error during roast playback:', error);
    }
    
    setIsSequentialPlaying(false);
    setIsPlaying(false);
    setCurrentWord('');
    setIsShowingWord(false);
    setCurrentlyDisplayedLine('');
  };

  const stopPlayback = () => {
    setIsSequentialPlaying(false);
    setIsPlaying(false);
    setCurrentlyDisplayedLine('');
    setCurrentWord('');
    setIsShowingWord(false);
    setAllWords([]);
    setCurrentWordIndex(0);
  };

  const playRoastLine = async (lineIndex: number) => {
    if (onTextToSpeech) {
      setCurrentLineIndex(lineIndex);
      setIsPlaying(true);
      setCurrentlyDisplayedLine(roastLines[lineIndex]);
      
      try {
        console.log(`Playing single line ${lineIndex + 1}: "${roastLines[lineIndex]}"`);
        const result = await onTextToSpeech(roastLines[lineIndex]);
        console.log(`Single line audio duration:`, result.duration, 'ms');
      } catch (error) {
        console.error('Error playing TTS:', error);
      } finally {
        setIsPlaying(false);
        setCurrentlyDisplayedLine('');
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If muting during playback, stop the playback
    if (newMutedState && isSequentialPlaying) {
      stopPlayback();
    }
    
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `roasted-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || scale <= 1) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPosition({
        x: dragStart.posX + deltaX,
        y: dragStart.posY + deltaY
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, scale]);

  // Reset position when scale changes
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  return (
    <div className={`relative ${className}`}>
      {/* Image Container with Caption Overlay */}
      <GlassCard className="overflow-hidden">
        <div className="aspect-[9/16] relative bg-black/20">
          {/* Image with transform controls */}
          <div 
            className="w-full h-full overflow-hidden cursor-move relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
            
            {/* Overlay ImageCaptionOverlay on top of the image */}
            {roastLines.length > 0 && (
              <div className="absolute inset-0">
                <ImageCaptionOverlay
                  imageUrl={src}
                  roastLines={roastLines}
                  audioData={audioData}
                  captionsData={captionsData}
                  onTextToSpeech={onTextToSpeech}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Image Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            {onRemove && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="w-10 h-10 p-0"
              >
                <X className="w-4 h-4" />
              </GlassButton>
            )}
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="w-10 h-10 p-0"
              disabled={scale >= 5}
            >
              <ZoomIn className="w-4 h-4" />
            </GlassButton>
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="w-10 h-10 p-0"
              disabled={scale <= 0.3}
            >
              <ZoomOut className="w-4 h-4" />
            </GlassButton>
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="w-10 h-10 p-0"
            >
              <RotateCw className="w-4 h-4" />
            </GlassButton>

          </div>

          {/* Scale indicator */}
          {scale !== 1 && (
            <div className="absolute bottom-4 left-4 z-10">
              <div className="glass-surface px-3 py-1 rounded-full text-sm">
                {Math.round(scale * 100)}%
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
        muted={isMuted}
      />
    </div>
  );
};