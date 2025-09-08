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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    // Get OpenAI API key from Supabase secrets  
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured in Supabase secrets');
    }

    console.log('Starting image analysis with OpenAI Vision...');

    // Analyze image with OpenAI Vision API
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for creating a roast. Identify: 1) People and their appearance (hair, clothing, facial features, expressions), 2) Objects and style elements, 3) Overall setting and context. Be detailed but objective. Return your analysis as a JSON object with properties: people (array), objects (array), style (array), setting (string).'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${visionResponse.status} - ${errorText}`);
    }

    const visionData = await visionResponse.json();
    
    if (!visionData.choices || visionData.choices.length === 0) {
      throw new Error('No response from OpenAI Vision API');
    }
    
    const analysisText = visionData.choices[0].message.content;
    console.log('Raw analysis response:', analysisText);

    // Try to extract JSON from the response
    let analysis;
    try {
      // Look for JSON in the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a structured response from the text
        analysis = {
          people: [analysisText.includes('person') || analysisText.includes('face') ? 'Person detected' : ''],
          objects: [],
          style: [],
          setting: analysisText
        };
      }
    } catch (parseError) {
      console.error('Failed to parse analysis JSON, using fallback:', parseError);
      // Create a basic analysis structure
      analysis = {
        people: ['Person in image'],
        objects: ['Various objects detected'],
        style: ['Visual elements present'],
        setting: analysisText
      };
    }

    // Create roastable targets from analysis
    const targets = [];
    
    // Add people-based targets
    if (analysis.people && analysis.people.length > 0) {
      analysis.people.forEach((person, index) => {
        if (person && person.trim()) {
          targets.push({
            type: 'person',
            name: `Person ${index + 1}`,
            description: person,
            confidence: 0.9,
          });
        }
      });
    }

    // Add object targets
    if (analysis.objects && analysis.objects.length > 0) {
      analysis.objects.forEach((obj, index) => {
        if (obj && obj.trim()) {
          targets.push({
            type: 'object',
            name: `Object ${index + 1}`,
            description: obj,
            confidence: 0.8,
          });
        }
      });
    }

    // Add style targets
    if (analysis.style && analysis.style.length > 0) {
      analysis.style.forEach((styleElement, index) => {
        if (styleElement && styleElement.trim()) {
          targets.push({
            type: 'style',
            name: `Style ${index + 1}`,
            description: styleElement,
            confidence: 0.7,
          });
        }
      });
    }

    console.log('Image analysis completed:', { 
      analysisKeys: Object.keys(analysis),
      targetsCount: targets.length,
      targets: targets.map(t => ({ type: t.type, name: t.name }))
    });

    return new Response(JSON.stringify({
      success: true,
      analysis,
      targets,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});