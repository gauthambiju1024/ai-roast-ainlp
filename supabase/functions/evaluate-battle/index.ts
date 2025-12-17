import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = "https://roastjudge-api-342803715506.asia-south1.run.app";
const EVAL_ENDPOINT = "/judge_battle";
const TIMEOUT_MS = 30000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thread_text } = await req.json();

    if (!thread_text || typeof thread_text !== 'string') {
      throw new Error('thread_text is required and must be a string');
    }

    console.log('=== Evaluate Battle Request ===');
    console.log('Thread length:', thread_text.length);
    console.log('Thread preview:', thread_text.substring(0, 200) + '...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${API_BASE_URL}${EVAL_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thread_text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RoastJudge API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log('=== RoastJudge API Response ===');
    console.log(JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-battle function:', error);
    
    const errorMessage = error instanceof Error 
      ? error.name === 'AbortError' 
        ? 'Request timed out after 30 seconds'
        : error.message
      : 'Unknown error';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
