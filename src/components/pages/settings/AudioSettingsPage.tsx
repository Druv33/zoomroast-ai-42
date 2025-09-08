import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface AudioSettingsPageProps {
  onBack: () => void;
}

export const AudioSettingsPage: React.FC<AudioSettingsPageProps> = ({ onBack }) => {
  const [volume, setVolume] = useState([80]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  useEffect(() => {
    // Load saved settings
    const savedVolume = localStorage.getItem('audioVolume');
    const savedMic = localStorage.getItem('micEnabled');
    const savedAutoPlay = localStorage.getItem('autoPlay');
    const savedSoundEffects = localStorage.getItem('soundEffects');

    if (savedVolume) setVolume([parseInt(savedVolume)]);
    if (savedMic) setMicEnabled(savedMic === 'true');
    if (savedAutoPlay) setAutoPlay(savedAutoPlay === 'true');
    if (savedSoundEffects) setSoundEffects(savedSoundEffects === 'true');
  }, []);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    localStorage.setItem('audioVolume', value[0].toString());
    
    // Apply volume immediately with a test sound
    const testAudio = new Audio();
    testAudio.volume = value[0] / 100;
  };

  const handleMicToggle = async (enabled: boolean) => {
    setMicEnabled(enabled);
    localStorage.setItem('micEnabled', enabled.toString());
    
    if (enabled) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error('Microphone access denied:', error);
        setMicEnabled(false);
        localStorage.setItem('micEnabled', 'false');
      }
    }
  };

  const handleAutoPlayToggle = (enabled: boolean) => {
    setAutoPlay(enabled);
    localStorage.setItem('autoPlay', enabled.toString());
  };

  const handleSoundEffectsToggle = (enabled: boolean) => {
    setSoundEffects(enabled);
    localStorage.setItem('soundEffects', enabled.toString());
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
              <Volume2 className="w-5 h-5 mr-2" />
              Audio Settings
            </GlassCardTitle>
          </GlassCardHeader>
        </GlassCard>

        <div className="space-y-6">
          {/* Volume Control */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="font-medium">Volume</span>
                </div>
                <span className="text-sm text-muted-foreground">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </GlassCardContent>
          </GlassCard>

          {/* Microphone */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  <div>
                    <div className="font-medium">Microphone</div>
                    <div className="text-sm text-muted-foreground">Enable voice input</div>
                  </div>
                </div>
                <Switch
                  checked={micEnabled}
                  onCheckedChange={handleMicToggle}
                />
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Auto Play */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Play Roasts</div>
                  <div className="text-sm text-muted-foreground">Automatically speak generated roasts</div>
                </div>
                <Switch
                  checked={autoPlay}
                  onCheckedChange={handleAutoPlayToggle}
                />
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Sound Effects */}
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound Effects</div>
                  <div className="text-sm text-muted-foreground">UI sounds and notifications</div>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={handleSoundEffectsToggle}
                />
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};