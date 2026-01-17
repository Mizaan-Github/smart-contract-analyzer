import { supabase } from "@/integrations/supabase/client";
import { ContractAnalysis } from "@/types/contracts";

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const { data, error } = await supabase.functions.invoke("analyze-contract", {
    body: { contractText, type: "analyze" },
  });

  if (error) {
    console.error("Error calling analyze-contract:", error);
    throw new Error(error.message || "Erreur lors de l'analyse du contrat");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  // Add IDs to clauses if not present
  const analysis: ContractAnalysis = {
    ...data,
    clauses: data.clauses.map((clause: any, index: number) => ({
      ...clause,
      id: clause.id || crypto.randomUUID(),
    })),
  };

  return analysis;
}

export async function askQuestion(question: string, contractContext: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("analyze-contract", {
    body: { type: "question", question, contractContext },
  });

  if (error) {
    console.error("Error calling analyze-contract:", error);
    throw new Error(error.message || "Erreur lors de la question");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.answer;
}

// Mock function for development/testing
export function mockAnalyzeContract(): Promise<ContractAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: Math.floor(Math.random() * 40) + 50,
        verdict: ["SIGNER", "NÉGOCIER", "REFUSER"][Math.floor(Math.random() * 3)] as ContractAnalysis["verdict"],
        type: "CDI",
        resume: "Contrat analysé avec succès. Plusieurs points d'attention ont été identifiés.",
        clauses: [
          {
            id: crypto.randomUUID(),
            texte: "Clause exemple détectée dans le contrat.",
            risque: "MOYEN",
            probleme: "Cette clause nécessite une attention particulière.",
            conseil: "Nous recommandons de négocier ce point.",
          },
        ],
      });
    }, 2000);
  });
}
