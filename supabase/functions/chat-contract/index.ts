import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FEATHERLESS_API_URL = 'https://api.featherless.ai/v1/chat/completions';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FEATHERLESS_API_KEY = Deno.env.get('FEATHERLESS_API_KEY');
    
    if (!FEATHERLESS_API_KEY) {
      console.error('FEATHERLESS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { question, contractContext } = await req.json();

    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'question is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Chat question:', question.substring(0, 100));

    const systemPrompt = `Tu es un assistant juridique expert et pédagogue. Tu aides les utilisateurs à comprendre leurs contrats de manière simple et accessible.

Règles :
- Réponds en français simple et clair
- Sois concis (2-4 phrases maximum)
- Si tu cites une clause, utilise des guillemets
- Donne des conseils pratiques et actionnables
- Ne donne pas de conseils juridiques définitifs, recommande de consulter un professionnel si nécessaire`;

    const userMessage = contractContext 
      ? `Contexte du contrat :\n${contractContext.substring(0, 3000)}\n\nQuestion : ${question}`
      : question;

    const response = await fetch(FEATHERLESS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Featherless API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI chat failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in chat response');
      return new Response(
        JSON.stringify({ error: 'No response received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the response (remove thinking tags if present)
    let cleanContent = content;
    cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    console.log('Chat response sent');
    
    return new Response(
      JSON.stringify({ response: cleanContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-contract function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
