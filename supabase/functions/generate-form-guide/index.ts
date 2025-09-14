import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-FORM-GUIDE] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Function started", { method: req.method });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const { imageBase64, language = 'english' } = await req.json();
    logStep("Request parsed", { language, hasImage: !!imageBase64 });

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Authentication failed", { error: userError });
      throw new Error('Authentication failed');
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    // Check subscription status and free trial limits
    const { data: profile } = await supabaseServiceRole
      .from('profiles')
      .select('forms_generated')
      .eq('user_id', user.id)
      .single();

    const formsGenerated = profile?.forms_generated || 0;
    logStep("User profile checked", { formsGenerated });

    // Check if user has subscription (simplified check for now)
    const isSubscribed = false; // TODO: Implement subscription check
    
    if (!isSubscribed && formsGenerated >= 1) {
      logStep("Free trial limit reached");
      return new Response(JSON.stringify({
        success: false,
        error: 'Free trial limit reached. Please upgrade to Premium for unlimited form guides.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upload image to Supabase Storage (for history/reference)
    const imageBuffer = Uint8Array.from(atob(imageBase64.split(',')[1]), c => c.charCodeAt(0));
    const fileName = `form-${user.id}-${Date.now()}.jpg`;
    
    const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
      .from('form-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
      });

    let imageUrl = '';
    if (!uploadError && uploadData) {
      const { data } = await supabaseServiceRole.storage
        .from('form-images')
        .getPublicUrl(uploadData.path);
      imageUrl = data.publicUrl;
      logStep("Image uploaded", { fileName, imageUrl });
    }

    // Get Google Gemini API key
    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    // Prepare prompt for form guidance
    const prompt = language === 'hindi' 
      ? `आप एक AI असिस्टेंट हैं जो लोगों को फॉर्म भरने में मदद करते हैं। इस फॉर्म की इमेज को देखिए और बताइए:

1. यह कौन सा फॉर्म है और इसका उद्देश्य क्या है?
2. इसमें कौन से फील्ड भरने होंगे?
3. हर फील्ड के लिए क्या जानकारी चाहिए होगी?
4. फॉर्म भरते समय क्या सावधानियां रखनी चाहिए?

कृपया 3-4 छोटे, स्पष्ट वाक्यों में जवाब दीजिए जो फॉर्म भरने में मदद करे।`
      : `You are an AI assistant that helps people fill out forms. Look at this form image and provide:

1. What type of form this is and its purpose
2. What fields need to be filled out
3. What information is required for each field
4. Important tips for filling out the form correctly

Please respond with 3-4 clear, helpful sentences that will guide someone through filling out this form.`;

    logStep("Calling Google Gemini API");

    // Call Google Gemini Vision API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(',')[1]
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      logStep("Gemini API error", { status: geminiResponse.status, error: errorText });
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    logStep("Gemini API response received");

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      logStep("No content in Gemini response", geminiData);
      throw new Error('No form guidance generated');
    }

    const formGuideText = geminiData.candidates[0].content.parts[0].text;
    
    // Split the guidance into lines for better presentation
    const formGuideLines = formGuideText.split('\n').filter(line => line.trim()).slice(0, 4);
    
    if (formGuideLines.length === 0) {
      throw new Error('No form guidance lines generated');
    }

    logStep("Form guidance generated", { linesCount: formGuideLines.length });

    // Generate word-level caption data for potential TTS sync
    const captions = formGuideLines.map((line, index) => ({
      text: line,
      start: index * 3,
      duration: Math.max(2, line.length * 0.08)
    }));

    // Save the form guide to database
    const { error: saveError } = await supabaseServiceRole
      .from('roasts')
      .insert({
        user_id: user.id,
        roast_lines: formGuideLines,
        image_url: imageUrl,
        status: 'completed'
      });

    if (saveError) {
      logStep("Error saving form guide", saveError);
    }

    // Update user's forms_generated count
    const { error: updateError } = await supabaseServiceRole
      .from('profiles')
      .update({ forms_generated: formsGenerated + 1 })
      .eq('user_id', user.id);

    if (updateError) {
      logStep("Error updating forms count", updateError);
    }

    logStep("Form guide generation completed successfully");

    return new Response(JSON.stringify({
      success: true,
      formGuide: {
        lines: formGuideLines
      },
      imageUrl,
      captions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    logStep("ERROR", { message: error.message, stack: error.stack });
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to generate form guide'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});