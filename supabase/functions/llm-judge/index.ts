import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { thread_text, winner } = await req.json();
    
    if (!thread_text) {
      return new Response(
        JSON.stringify({ error: 'thread_text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt based on winner status
    const isTie = winner === "TIE";
    
    const prompt = `You are an expert comedy judge analyzing a roast battle transcript.

TRANSCRIPT:
${thread_text}

WINNER: ${winner}

YOUR TASKS:
${isTie ? `
TASK 1 — Funniest Line Overall (TIE scenario)
Pick the single funniest line from the entire battle (from either A or B).
` : `
TASK 1 — Winner's Funniest Line
Pick the single funniest line from Player ${winner}'s roasts only.
`}

TASK 2 — Brief Justification (1–2 sentences max)
Explain why this line stood out.
Focus on humor mechanics, not personal opinion.
Do not praise personalities — judge the roast quality only.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks):
${isTie ? `{
  "overall_funniest_line": {
    "speaker": "A" or "B",
    "line": "exact quote from transcript"
  },
  "justification": "1-2 sentence explanation of humor mechanics"
}` : `{
  "winner_funniest_line": {
    "speaker": "${winner}",
    "line": "exact quote from transcript"
  },
  "justification": "1-2 sentence explanation of humor mechanics"
}`}`;

    console.log('Calling Gemini API for LLM judge...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to call Gemini API', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiResponse = await response.json();
    console.log('Gemini response:', JSON.stringify(geminiResponse, null, 2));

    // Extract the text content from Gemini response
    const textContent = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error('No text content in Gemini response');
      return new Response(
        JSON.stringify({ error: 'No content in Gemini response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON from the response (handle potential markdown code blocks)
    let parsedResult;
    try {
      // Remove potential markdown code blocks
      const cleanedText = textContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      parsedResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', textContent);
      // Return a fallback response
      return new Response(
        JSON.stringify({
          winner_funniest_line: isTie ? undefined : { speaker: winner, line: "Unable to extract specific line" },
          overall_funniest_line: isTie ? { speaker: "A", line: "Unable to extract specific line" } : undefined,
          justification: "The AI judge was unable to parse the response properly."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsed LLM judge result:', parsedResult);

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('LLM Judge error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
