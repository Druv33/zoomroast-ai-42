// Sound utility for click sounds and TTS fallback
export class SoundUtils {
  private audioContext: AudioContext | null = null;

  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  // Generate click sound using Web Audio API
  async playClickSound(): Promise<void> {
    try {
      const audioContext = await this.getAudioContext();
      
      // Create oscillator for click sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure click sound (short beep)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Click sound failed:', error);
    }
  }

  // Generate hover sound
  async playHoverSound(): Promise<void> {
    try {
      const audioContext = await this.getAudioContext();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Softer hover sound
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.log('Hover sound failed:', error);
    }
  }

  // Enhanced TTS with ElevenLabs API and browser fallback
  async speakText(text: string, voice: 'male' | 'female' = 'male', language: 'english' | 'hindi' = 'hindi'): Promise<void> {
    try {
      // First try ElevenLabs API
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text, voice, language }
      });

      if (error) {
        console.log('TTS API error, using browser fallback:', error);
        return this.useBrowserTTS(text, voice, language);
      }

      // Check if we should use browser TTS (quota exceeded)
      if (data?.useBuiltInTTS) {
      console.log('ElevenLabs quota limit reached, using browser TTS with language optimization');
        return this.useBrowserTTS(text, voice, language);
      }

      // Play ElevenLabs audio if available
      if (data?.success && data?.audioBase64) {
        const audioData = `data:audio/mp3;base64,${data.audioBase64}`;
        const audio = new Audio(audioData);
        await audio.play();
        console.log('TTS played successfully using ElevenLabs');
        return;
      }

      // Fallback to browser TTS
      return this.useBrowserTTS(text, voice, language);
      
    } catch (error) {
      console.log('TTS error, using browser fallback:', error);
      return this.useBrowserTTS(text, voice, language);
    }
  }

  // Browser speech synthesis fallback
  private useBrowserTTS(text: string, voice: 'male' | 'female', language: 'english' | 'hindi' = 'hindi'): void {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        
        // Find appropriate voice based on language and gender
        let languageVoice;
        if (language === 'english') {
          languageVoice = voices.find(v => 
            v.lang === 'en' || v.lang === 'en-US' || v.lang === 'en-GB' ||
            (v.lang.startsWith('en') && !v.name.toLowerCase().includes('hindi'))
          );
        } else {
          languageVoice = voices.find(v => 
            v.lang === 'hi' || v.lang === 'hi-IN' || 
            v.name.toLowerCase().includes('hindi') || 
            v.name.toLowerCase().includes('kavya') ||
            v.name.toLowerCase().includes('aditi')
          );
        }
        
        const genderVoice = voices.find(v => 
          voice === 'female' 
            ? (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || 
               (language === 'hindi' && v.name.toLowerCase().includes('aditi')))
            : (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'))
        );
        
        const preferredVoice = languageVoice || genderVoice || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Optimize settings based on language
        utterance.rate = language === 'english' ? 0.9 : 0.85; // Slightly slower for Hindi
        utterance.pitch = voice === 'female' ? 1.1 : 0.9;
        utterance.volume = 0.8;
        utterance.lang = language === 'english' ? 'en-US' : 'hi-IN'; // Set appropriate language
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Speech synthesis failed:', error);
    }
  }
}

// Global instance
export const soundUtils = new SoundUtils();