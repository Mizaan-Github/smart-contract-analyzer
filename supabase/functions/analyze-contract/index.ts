import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_URL = "https://api.featherless.ai/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FEATHERLESS_API_KEY = Deno.env.get("FEATHERLESS_API_KEY");
    if (!FEATHERLESS_API_KEY) {
      throw new Error("FEATHERLESS_API_KEY is not configured");
    }

    const { contractText, type } = await req.json();

    if (type === "analyze") {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-32B",
          messages: [
            {
              role: "system",
              content: `Tu es un expert juridique français. Analyse ce contrat et retourne UNIQUEMENT du JSON valide sans commentaires ni texte supplémentaire :
{
  "score": <nombre entre 0 et 100>,
  "verdict": "<SIGNER|NÉGOCIER|REFUSER>",
  "type": "<CDI|CDD|Bail|Assurance|Autre>",
  "resume": "<résumé en 2 phrases maximum>",
  "clauses": [
    {
      "texte": "<extrait de la clause>",
      "risque": "<ÉLEVÉ|MOYEN|FAIBLE>",
      "probleme": "<explication simple du problème>",
      "conseil": "<action recommandée>"
    }
  ]
}`,
            },
            { role: "user", content: contractText },
          ],
          temperature: 0.1,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Featherless API error:", response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean the response - remove markdown code blocks if present
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const analysis = JSON.parse(content);

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (type === "question") {
      const { question, contractContext } = await req.json();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-8B",
          messages: [
            {
              role: "system",
              content: "Tu es un assistant juridique français. Réponds en 2-3 phrases en français simple et accessible.",
            },
            {
              role: "user",
              content: `Contexte du contrat: ${contractContext.substring(0, 2000)}\n\nQuestion: ${question}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ answer: data.choices[0].message.content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid request type");
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
