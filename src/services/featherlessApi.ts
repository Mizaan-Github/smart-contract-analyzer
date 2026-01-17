import { ContractAnalysis } from '@/types/contracts';

const API_URL = 'https://api.featherless.ai/v1/chat/completions';
// NOTE: Cette clé doit être remplacée par votre vraie clé API
const API_KEY = 'REMPLACER_PAR_MA_CLE';

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen3-32B',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert juridique français. Analyse ce contrat et retourne UNIQUEMENT du JSON :
{
  "score": <0-100>,
  "verdict": "<SIGNER|NÉGOCIER|REFUSER>",
  "type": "<CDI|CDD|Bail|Assurance|Autre>",
  "resume": "<2 phrases>",
  "clauses": [
    {
      "texte": "<extrait>",
      "risque": "<ÉLEVÉ|MOYEN|FAIBLE>",
      "probleme": "<explication simple>",
      "conseil": "<action recommandée>"
    }
  ]
}`
        },
        { role: 'user', content: contractText }
      ],
      temperature: 0.1,
      max_tokens: 3000
    })
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function askQuestion(question: string, contractContext: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen3-8B',
      messages: [
        { role: 'system', content: 'Tu es un assistant juridique. Réponds en 2-3 phrases en français simple.' },
        { role: 'user', content: `Contrat: ${contractContext.substring(0, 2000)}\n\nQuestion: ${question}` }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Fonction mock pour le développement
export function mockAnalyzeContract(): Promise<ContractAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: Math.floor(Math.random() * 40) + 50,
        verdict: ['SIGNER', 'NÉGOCIER', 'REFUSER'][Math.floor(Math.random() * 3)] as ContractAnalysis['verdict'],
        type: 'CDI',
        resume: 'Contrat analysé avec succès. Plusieurs points d\'attention ont été identifiés.',
        clauses: [
          {
            id: crypto.randomUUID(),
            texte: 'Clause exemple détectée dans le contrat.',
            risque: 'MOYEN',
            probleme: 'Cette clause nécessite une attention particulière.',
            conseil: 'Nous recommandons de négocier ce point.'
          }
        ]
      });
    }, 2000);
  });
}
