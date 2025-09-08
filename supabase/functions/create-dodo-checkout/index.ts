import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { plan } = await req.json();
    
    // Dodo Payment Integration
    const dodoApiKey = Deno.env.get("DODO_API_KEY") || "";
    const dodoApiUrl = "https://api.dodopayment.com/v1/checkout"; // Replace with actual Dodo API URL
    
    const priceAmount = plan === 'yearly' ? 30 : 3; // In actual currency units
    const planName = plan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium';
    
    // Create Dodo payment session
    const dodoPayload = {
      amount: priceAmount,
      currency: "USD",
      customer_email: user.email,
      plan: plan,
      product_name: "SnapRoast Premium",
      description: `SnapRoast ${planName} Subscription`,
      success_url: `${req.headers.get("origin")}/`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        user_id: user.id,
        subscription_plan: plan
      }
    };

    const dodoResponse = await fetch(dodoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dodoPayload)
    });

    if (!dodoResponse.ok) {
      throw new Error(`Dodo Payment API error: ${dodoResponse.statusText}`);
    }

    const dodoData = await dodoResponse.json();
    
    // Return the Dodo checkout URL
    return new Response(JSON.stringify({ url: dodoData.checkout_url || dodoData.payment_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Dodo Payment Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});