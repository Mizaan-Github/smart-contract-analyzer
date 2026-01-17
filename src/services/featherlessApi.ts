import { ContractAnalysis } from '@/types/contracts';
import { supabase } from '@/integrations/supabase/client';

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  console.log('Calling analyze-contract edge function...');
  
  const { data, error } = await supabase.functions.invoke('analyze-contract', {
    body: { contractText }
  });
  
  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Erreur lors de l\'analyse');
  }
  
  if (data.error) {
    console.error('API error:', data.error);
    throw new Error(data.error);
  }
  
  // Add IDs to clauses
  const analysis: ContractAnalysis = {
    ...data,
    clauses: (data.clauses || []).map((clause: any) => ({
      ...clause,
      id: crypto.randomUUID()
    }))
  };
  
  return analysis;
}

export async function askQuestion(question: string, contractContext: string): Promise<string> {
  console.log('Calling chat-contract edge function...');
  
  const { data, error } = await supabase.functions.invoke('chat-contract', {
    body: { question, contractContext }
  });
  
  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Erreur lors de la requête');
  }
  
  if (data.error) {
    console.error('API error:', data.error);
    throw new Error(data.error);
  }
  
  return data.response;
}

// Extract text from file on client side
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return file.text();
    case 'pdf':
      // For PDF, we'll read as base64 and send to edge function for extraction
      return extractPDFViaEdgeFunction(file);
    case 'png':
    case 'jpg':
    case 'jpeg':
      return `[Image détectée: ${file.name}] - L'extraction OCR n'est pas encore implémentée. Veuillez utiliser un fichier PDF ou TXT.`;
    default:
      throw new Error(`Format non supporté: .${extension}. Utilisez PDF ou TXT.`);
  }
}

async function extractPDFViaEdgeFunction(file: File): Promise<string> {
  // Read file as base64
  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  
  const { data, error } = await supabase.functions.invoke('extract-pdf', {
    body: { pdfBase64: base64, fileName: file.name }
  });
  
  if (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Erreur lors de l\'extraction du PDF');
  }
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data.text;
}

// Mock function for development/testing
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
