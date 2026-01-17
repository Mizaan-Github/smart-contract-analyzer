import { createContext, useContext, useState, ReactNode } from 'react';
import { Contract } from '@/types/contracts';
import { mockContracts } from '@/data/mockContracts';

interface ContractsContextType {
  contracts: Contract[];
  contractTexts: Record<string, string>;
  addContract: (contract: Contract) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  setContractText: (id: string, text: string) => void;
  getContract: (id: string) => Contract | undefined;
  getContractText: (id: string) => string | undefined;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [contractTexts, setContractTexts] = useState<Record<string, string>>({});

  const addContract = (contract: Contract) => {
    setContracts(prev => [...prev, contract]);
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const setContractText = (id: string, text: string) => {
    setContractTexts(prev => ({ ...prev, [id]: text }));
  };

  const getContract = (id: string) => contracts.find(c => c.id === id);

  const getContractText = (id: string) => contractTexts[id];

  return (
    <ContractsContext.Provider value={{
      contracts,
      contractTexts,
      addContract,
      updateContract,
      setContractText,
      getContract,
      getContractText
    }}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
}
