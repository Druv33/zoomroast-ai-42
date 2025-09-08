import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'male', language = 'hindi' } = await req.json();
    
    if (!text) {
      throw new Error('Text is required for TTS generation');
    }

    // Get ElevenLabs API key from Supabase secrets
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ElevenLabs API key not configured in Supabase secrets');
    }

    // Select appropriate voices based on language and gender
    let voiceId;
    if (language === 'english') {
      voiceId = voice === 'female' ? 'EXAVITQu4vr4xnSDxMaL' : 'onwK4e9ZLuTAKqWW03F9'; // Sarah for female, Daniel for male (English)
    } else {
      voiceId = voice === 'female' ? 'AZnzlk1XvdvUeBnXmlld' : 'GBv7mTt0atIp3Br8iCZE'; // Domi for female, Thomas for male (Hindi)
    }
    
    console.log('Generating TTS using ElevenLabs API for:', { voice, voiceId, textLength: text.length });

    // Use ElevenLabs Text-to-Speech API
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Best quality multilingual model
        voice_settings: {
          stability: language === 'english' ? 0.7 : 0.5, // Higher stability for English, lower for Hindi
          similarity_boost: 0.9, // Higher for better voice consistency
          style: language === 'english' ? 0.2 : 0.3, // Slight style variation
          use_speaker_boost: true
        },
        language_code: language === 'english' ? 'en' : 'hi' // Set appropriate language code
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs TTS API error:', errorText);
      throw new Error(`ElevenLabs TTS API error: ${ttsResponse.status}`);
    }

    // Convert audio buffer to base64
    const arrayBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('TTS generated successfully using ElevenLabs API');

    return new Response(JSON.stringify({
      success: true,
      audioBase64: base64Audio,
      duration: Math.ceil(text.length / 12), // ElevenLabs is slightly faster: ~12 chars per second
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-tts function:', error);
    
    // Check for quota or credit issues more comprehensively
    const errorString = error.message.toLowerCase();
    const isQuotaError = errorString.includes('quota') || 
                        errorString.includes('429') || 
                        errorString.includes('insufficient_quota') ||
                        errorString.includes('credits') ||
                        errorString.includes('401'); // 401 can also indicate quota issues
    
    if (isQuotaError) {
      console.log('ElevenLabs quota/credits exhausted, using browser TTS fallback');
      return new Response(JSON.stringify({ 
        success: true, // Return success to trigger browser fallback
        useBuiltInTTS: true,
        message: 'Using browser voice due to ElevenLabs quota limit'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});