import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";

// Agent configuration - maps personality_intensity to agentId and apiKeyGroup
const LYZR_AGENTS: Record<string, { agentId: string; apiKeyGroup: 1 | 2 }> = {
  "amitabh_spicy": { agentId: "6942d2c5707dd1e4d8ed444d", apiKeyGroup: 1 },
  "genz_spicy": { agentId: "6942cfe24f5531c6f3c726d6", apiKeyGroup: 1 },
  "hawking_spicy": { agentId: "6942b02c9a5e5f6c59d90671", apiKeyGroup: 2 },
  "messi_spicy": { agentId: "694143493cc5fbe223afb86f", apiKeyGroup: 2 },
  "trump_spicy": { agentId: "6942ca5b707dd1e4d8ed3cb3", apiKeyGroup: 2 },
  "gandhi_spicy": { agentId: "6942c9d94f5531c6f3c72111", apiKeyGroup: 2 },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { personality_id, intensity_id, user_id, session_id, message } = await req.json();
    
    console.log("=== Lyzr Chat Request ===");
    console.log(`Personality: ${personality_id}, Intensity: ${intensity_id}`);
    console.log(`User ID: ${user_id}, Session ID: ${session_id}`);
    console.log(`Message: ${message.substring(0, 100)}...`);

    // Get agent configuration
    const agentKey = `${personality_id}_${intensity_id}`;
    const agentConfig = LYZR_AGENTS[agentKey];

    if (!agentConfig) {
      console.error(`No agent found for key: ${agentKey}`);
      return new Response(
        JSON.stringify({ error: `Agent not configured for ${agentKey}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the correct API key
    const apiKey = agentConfig.apiKeyGroup === 1 
      ? Deno.env.get('LYZR_API_KEY_1')
      : Deno.env.get('LYZR_API_KEY_2');

    if (!apiKey) {
      console.error(`API key not found for group ${agentConfig.apiKeyGroup}`);
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Using agent: ${agentConfig.agentId}, API key group: ${agentConfig.apiKeyGroup}`);

    // Call Lyzr API
    const lyzrResponse = await fetch(LYZR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        user_id: user_id,
        agent_id: agentConfig.agentId,
        session_id: session_id,
        message: message,
      }),
    });

    if (!lyzrResponse.ok) {
      const errorText = await lyzrResponse.text();
      console.error(`Lyzr API error: ${lyzrResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Lyzr API error: ${lyzrResponse.status}`, details: errorText }),
        { status: lyzrResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await lyzrResponse.json();
    console.log("=== Lyzr API Response ===");
    console.log(JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lyzr-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
