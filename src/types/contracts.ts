export type RiskLevel = 'ÉLEVÉ' | 'MOYEN' | 'FAIBLE';
export type Verdict = 'SIGNER' | 'NÉGOCIER' | 'REFUSER';
export type ContractType = 'CDI' | 'CDD' | 'Bail' | 'Assurance' | 'Autre';
export type ContractStatus = 'pending' | 'analyzing' | 'completed';

export interface Clause {
  id: string;
  texte: string;
  risque: RiskLevel;
  probleme: string;
  conseil: string;
}

export interface ContractAnalysis {
  score: number;
  verdict: Verdict;
  type: ContractType;
  resume: string;
  clauses: Clause[];
}

export interface Contract {
  id: string;
  name: string;
  fileName: string;
  status: ContractStatus;
  uploadedAt: Date;
  analyzedAt?: Date;
  analysis?: ContractAnalysis;
  content?: string;
  progress?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
