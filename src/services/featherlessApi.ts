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

// Extract text from PDF using pdfjs-dist
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
}

// Extract text from image using OCR (placeholder - would need real OCR service)
export async function extractTextFromImage(file: File): Promise<string> {
  // For now, return a message indicating image support needs OCR
  // In production, you'd integrate with Tesseract.js or a cloud OCR service
  console.log('Image file detected:', file.name);
  return `[Image détectée: ${file.name}] - L'extraction OCR n'est pas encore implémentée. Veuillez utiliser un fichier PDF ou TXT.`;
}

// Main function to extract text from any supported file
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return extractTextFromPDF(file);
    case 'txt':
      return file.text();
    case 'png':
    case 'jpg':
    case 'jpeg':
      return extractTextFromImage(file);
    default:
      throw new Error(`Format non supporté: .${extension}`);
  }
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
