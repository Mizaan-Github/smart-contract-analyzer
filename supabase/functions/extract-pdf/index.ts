import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, fileName } = await req.json();

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: 'pdfBase64 is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracting text from PDF:', fileName);

    // Decode base64 to buffer
    const binaryString = atob(pdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Simple text extraction from PDF
    // This is a basic extraction that works for text-based PDFs
    const text = extractTextFromPDFBuffer(bytes);
    
    console.log('PDF text extracted, length:', text.length);

    if (text.length < 50) {
      // If extraction yields very little text, the PDF might be image-based
      return new Response(
        JSON.stringify({ 
          text: `[PDF scanné détecté: ${fileName}]\n\nCe PDF semble être un scan ou une image. Pour une meilleure analyse, veuillez:\n1. Utiliser un PDF avec du texte sélectionnable\n2. Ou copier-coller le texte directement\n\nTexte extrait (si disponible):\n${text}`,
          pages: 1,
          warning: 'Limited text extraction'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        text: text,
        pages: 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PDF extraction error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to extract PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Basic PDF text extraction
// Extracts text from PDF streams - works for most text-based PDFs
function extractTextFromPDFBuffer(bytes: Uint8Array): string {
  const text = new TextDecoder('latin1').decode(bytes);
  const extractedText: string[] = [];
  
  // Extract text from PDF streams
  // Look for text between BT (begin text) and ET (end text) markers
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match;
  
  while ((match = streamRegex.exec(text)) !== null) {
    const streamContent = match[1];
    
    // Extract text from Tj and TJ operators
    const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(streamContent)) !== null) {
      const decoded = decodePDFString(tjMatch[1]);
      if (decoded.trim()) {
        extractedText.push(decoded);
      }
    }
    
    // Extract text from TJ arrays
    const tjArrayRegex = /\[((?:[^\[\]]*|\[(?:[^\[\]]*|\[[^\[\]]*\])*\])*)\]\s*TJ/gi;
    let tjArrayMatch;
    while ((tjArrayMatch = tjArrayRegex.exec(streamContent)) !== null) {
      const arrayContent = tjArrayMatch[1];
      const stringRegex = /\(((?:[^()\\]|\\.)*)\)/g;
      let stringMatch;
      while ((stringMatch = stringRegex.exec(arrayContent)) !== null) {
        const decoded = decodePDFString(stringMatch[1]);
        if (decoded.trim()) {
          extractedText.push(decoded);
        }
      }
    }
  }
  
  // Also try to extract any readable text directly
  const directTextRegex = /\(((?:[^()\\]|\\.){10,})\)/g;
  let directMatch;
  while ((directMatch = directTextRegex.exec(text)) !== null) {
    const decoded = decodePDFString(directMatch[1]);
    // Filter out binary/encoded content
    if (decoded.trim() && /^[\x20-\x7E\xA0-\xFF\s]+$/.test(decoded)) {
      extractedText.push(decoded);
    }
  }
  
  // Remove duplicates and join
  const uniqueText = [...new Set(extractedText)];
  return uniqueText.join(' ').replace(/\s+/g, ' ').trim();
}

function decodePDFString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}
