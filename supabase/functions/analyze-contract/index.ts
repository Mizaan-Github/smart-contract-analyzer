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

    const { contractText } = await req.json();

    if (!contractText || typeof contractText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'contractText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing contract, text length:', contractText.length);

    const systemPrompt = `Tu es un expert juridique français spécialisé dans l'analyse de contrats. Analyse ce contrat et retourne UNIQUEMENT du JSON valide sans aucun texte avant ou après, avec cette structure exacte :
{
  "score": <nombre entre 0 et 100>,
  "verdict": "<SIGNER|NÉGOCIER|REFUSER>",
  "type": "<CDI|CDD|Bail|Assurance|Freelance|Autre>",
  "resume": "<résumé en 2-3 phrases maximum>",
  "clauses": [
    {
      "texte": "<extrait exact de la clause problématique>",
      "risque": "<ÉLEVÉ|MOYEN|FAIBLE>",
      "probleme": "<explication simple du problème>",
      "conseil": "<action recommandée>"
    }
  ]
}

Règles d'analyse :
- Score 80-100 = SIGNER (contrat favorable)
- Score 50-79 = NÉGOCIER (clauses à revoir)
- Score 0-49 = REFUSER (risques majeurs)
- Identifie au moins 2-5 clauses importantes
- Priorise les clauses à risque ÉLEVÉ`;

    const response = await fetch(FEATHERLESS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen3-32B',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contractText.substring(0, 15000) } // Limit text length
        ],
        temperature: 0.1,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Featherless API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Featherless API response received');

    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response:', data);
      return new Response(
        JSON.stringify({ error: 'No analysis content received' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonContent = objectMatch[0];
      }
    }

    try {
      const analysis = JSON.parse(jsonContent);
      console.log('Analysis parsed successfully:', analysis.verdict, analysis.score);
      
      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError, 'Content:', jsonContent.substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'Failed to parse analysis', rawContent: content.substring(0, 1000) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-contract function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
