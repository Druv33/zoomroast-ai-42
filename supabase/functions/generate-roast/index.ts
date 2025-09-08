import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-ROAST] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { imageBase64, language = 'hindi' } = await req.json();
    
    if (!imageBase64) {
      logStep("ERROR: Missing required data", { hasImage: !!imageBase64 });
      throw new Error('Image data is required');
    }

    // Get Google Gemini API key from Supabase secrets (only using Gemini)
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_GEMINI_API_KEY');
    
    logStep('API Keys Status', {
      gemini: geminiApiKey ? 'configured' : 'missing'
    });
    
    if (!geminiApiKey) {
      logStep('ERROR: Google Gemini API key not found');
      throw new Error('Google Gemini API key not configured. Please contact support.');
    }

    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep('ERROR: No authorization header');
      throw new Error('User authentication required');
    }
    
    const token = authHeader.replace('Bearer ', '');
    logStep("Authenticating user");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      logStep('ERROR: User not authenticated');
      throw new Error('User not authenticated');
    }
    
    logStep("User authenticated", { userId: user.id });

    // Check subscription status and free trial limit
    const { data: profile } = await supabaseService
      .from('profiles')
      .select('subscription_active, roasts_generated')
      .eq('user_id', user.id)
      .single();
    
    const roastsGenerated = profile?.roasts_generated || 0;
    
    // Allow free trial (1 roast) or subscription
    if (!profile?.subscription_active && roastsGenerated >= 1) {
      logStep('ERROR: Free trial limit reached', { roastsGenerated });
      throw new Error('Free trial limit reached. Please upgrade to Premium for 49 monthly roasts.');
    }
    
    logStep("Free trial or subscription verified", { 
      isSubscribed: profile?.subscription_active, 
      roastsGenerated 
    });

    // Store image in Supabase Storage first
    let imageUrl = null;
    try {
      // Convert base64 to blob
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const fileName = `roast-images/${user.id}/${Date.now()}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabaseService.storage
        .from('user-uploads')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        logStep('Image upload failed', { error: uploadError.message });
      } else {
        const { data: publicUrl } = supabaseService.storage
          .from('user-uploads')
          .getPublicUrl(fileName);
        imageUrl = publicUrl.publicUrl;
        logStep('Image uploaded successfully', { imageUrl });
      }
    } catch (imageError) {
      logStep('Image upload error', { error: imageError.message });
      // Continue without image URL - not critical for roast generation
    }

    // Check for inappropriate content first
    const inappropriateKeywords = [
      'sexual', 'nude', 'explicit', 'racist', 'hate', 'violence', 'political', 
      'religion', 'discrimination', 'harassment', 'threatening', 'bullying'
    ];
    
    // Simple content check - in production this would be more sophisticated
    const hasInappropriateContent = false; // Placeholder for actual content moderation
    
    if (hasInappropriateContent) {
      logStep('Inappropriate content detected');
      return new Response(JSON.stringify({
        success: true,
        roast: {
          lines: ["Nice try, but we roast only with love ❤️"]
        },
        imageUrl: imageUrl,
        captions: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare roast generation prompt based on selected language
    const hindiPrompt = `You are a Gen-Z roast comedian. Look at this image and generate exactly 5 fun, light-hearted, non-offensive roast lines about the person's appearance, style, and overall vibe.

Rules:
- Generate only fun, light-hearted, non-offensive roasts
- Use little GenZ words and meme references
- Write in HINDI language but use ENGLISH letters (transliteration)
- Each line must be 5-12 words maximum
- Target Gen-Z humor with Hindi slang mixed with English
- Be playful but NOT cruel, harassment, hate speech, sexual, political, or violent
- Keep all roasts in a playful, friendly tone
- No slurs, hate speech, or body shaming
- Focus on style choices, expressions, poses, not unchangeable physical features
- Make it funny and memey, not mean
- Use Hindi words like: bhai, yaar, kya, toh, waah, arre, dekho, lagta, hai, etc.
- Mix Hindi with English for Gen-Z effect like: "yaar tu toh", "bhai kya scene hai", "arre main character energy"
- Add meme references when possible
- Return JSON format with "lines" array

Example response:
{
  "lines": [
    "Bhai tera haircut toh barber se bhi galat ho gaya",
    "Yaar yeh shirt clearance sale mein mili hai kya",
    "Arre yeh glasses anime character jaisi lag rahi",
    "Pose dekh ke lagta hai mom ne photo li hai", 
    "Background tumse zyada interesting hai yaar"
  ]
}`;

    const englishPrompt = `You are a Gen-Z roast comedian. Look at this image and generate exactly 5 fun, light-hearted, non-offensive roast lines about the person's appearance, style, and overall vibe.

Rules:
- Generate only fun, light-hearted, non-offensive roasts
- Use Gen-Z slang and modern internet memes
- Write in ENGLISH language
- Each line must be 5-12 words maximum
- Target Gen-Z humor with modern slang and meme references
- Be playful but NOT cruel, harassment, hate speech, sexual, political, or violent
- Keep all roasts in a playful, friendly tone
- No slurs, hate speech, or body shaming
- Focus on style choices, expressions, poses, not unchangeable physical features
- Make it funny and memey, not mean
- Use words like: bruh, no cap, fr fr, periodt, that's a vibe, main character energy, etc.
- Add internet meme references when possible
- Return JSON format with "lines" array

Example response:
{
  "lines": [
    "That haircut said let me speak to manager",
    "Your fit is giving clearance rack energy fr",
    "Main character vibes but background actor execution",
    "That pose screams mom took this photo",
    "The background has more personality than you"
  ]
}`;

    const prompt = language === 'english' ? englishPrompt : hindiPrompt;

    let roastResponse;
    
    // Use Google Gemini Vision API for image analysis and roast generation
    logStep('Using Google Gemini Vision API for roast generation');
    try {
      // Convert base64 to proper format for Gemini
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          }),
        }
      );
      
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        logStep('Gemini Vision API error', { status: geminiResponse.status, error: errorText });
        throw new Error(`Gemini Vision API error: ${geminiResponse.status}`);
      }
      
      const geminiData = await geminiResponse.json();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        logStep('Gemini Vision response received');
        try {
          roastResponse = JSON.parse(text.replace(/```json\n?/, '').replace(/\n?```/, ''));
          logStep('Gemini Vision JSON parsed successfully');
        } catch (parseError) {
          logStep('Gemini Vision JSON parsing failed, using fallback', { error: parseError.message });
          // Language-aware fallback roasts
          roastResponse = {
            lines: language === 'english'
              ? [
                  "That fit is serving clearance rack energy fr",
                  "Main character vibes but background actor execution",
                  "Bro posed like mom said smile or no wifi",
                  "Haircut said trust the process but it's loading",
                  "Background has more personality than this pose"
                ]
              : [
                  "Bhai tera style toh thrift store clearance jaise hai",
                  "Yeh pose dekh ke confidence kahan gaya yaar",
                  "Main character energy hai par background actor vibes",
                  "Fashion sense ne toh aaj chutti le li hai",
                  "Looks serve kar raha hai jo kisi ne order nahi kiya"
                ]
          };
        }
      } else {
        throw new Error('No text content received from Gemini Vision');
      }
    } catch (geminiError) {
      logStep('Gemini Vision API failed, using fallback roasts', { error: geminiError.message });
      // Language-aware fallback roasts
      roastResponse = {
        lines: language === 'english'
          ? [
              "That fit is serving clearance rack energy fr",
              "Main character vibes but background actor execution",
              "Bro posed like mom said smile or no wifi",
              "Haircut said trust the process but it's loading",
              "Background has more personality than this pose"
            ]
          : [
              "Bhai tera style toh thrift store clearance jaise hai",
              "Yeh pose dekh ke confidence kahan gaya yaar",
              "Main character energy hai par background actor vibes",
              "Fashion sense ne toh aaj chutti le li hai",
              "Looks serve kar raha hai jo kisi ne order nahi kiya"
            ]
      };
    }

    if (!roastResponse) {
      logStep('ERROR: All AI APIs failed');
      throw new Error('Failed to generate roast - AI services temporarily unavailable');
    }

    logStep('Roast generated successfully', { linesCount: roastResponse.lines?.length });

    // Generate word-level captions with timing using simple word-based calculation
    let captionsData = null;
    if (roastResponse.lines) {
      try {
        logStep('Generating word-level captions with timing');
        
        // Create caption data with word-level timing (simple calculation)
        const words: any[] = [];
        let currentTime = 0;
        const avgWordsPerSecond = 2.5; // Average speaking speed in Hindi
        
        roastResponse.lines.forEach((line: string, lineIndex: number) => {
          const lineWords = line.split(' ');
          lineWords.forEach((word: string, wordIndex: number) => {
            const duration = 60 / avgWordsPerSecond / 100; // Duration per word in seconds
            words.push({
              word: word,
              start: currentTime,
              end: currentTime + duration,
              confidence: 0.95,
              lineIndex: lineIndex,
              wordIndex: wordIndex
            });
            currentTime += duration + 0.1; // Small pause between words
          });
          currentTime += 0.5; // Pause between lines
        });
        
        captionsData = {
          words: words,
          lines: roastResponse.lines.map((line: string, index: number) => ({
            text: line,
            index: index,
            startTime: words.find(w => w.lineIndex === index)?.start || 0,
            endTime: words.filter(w => w.lineIndex === index).pop()?.end || 0
          }))
        };
        
        logStep('Captions generated successfully', { wordsCount: words.length });
      } catch (captionsError) {
        logStep('Captions generation failed', { error: captionsError.message });
        // Continue without captions - not critical for core functionality
      }
    }

    // Store roast in database (optional - don't fail if DB operations fail)
    let roastRecord = null;
    try {
      const { data } = await supabaseService
        .from('roasts')
        .insert({
          user_id: user.id,
          roast_lines: roastResponse.lines,
          image_url: imageUrl,
          captions_data: captionsData,
          status: 'generated'
        })
        .select()
        .single();
      
      roastRecord = data;
      logStep('Roast stored in database');

      // Update user's roast count (increment existing count)
      try {
        const currentRoasts = profile?.roasts_generated || 0;
        await supabaseService
          .from('profiles')
          .update({ 
            roasts_generated: currentRoasts + 1
          })
          .eq('user_id', user.id);
        logStep('User roast count incremented', { newCount: currentRoasts + 1 });
      } catch (profileError) {
        logStep('Failed to update user profile', { error: profileError.message });
      }
      
    } catch (dbError) {
      logStep('Failed to store roast in database', { error: dbError.message });
      // Continue anyway - the roast generation was successful
    }

    logStep('Function completed successfully');

    return new Response(JSON.stringify({
      success: true,
      roast: roastResponse,
      roastId: roastRecord?.id,
      imageUrl: imageUrl,
      captions: captionsData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('ERROR in generate-roast function', { message: error.message });
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});