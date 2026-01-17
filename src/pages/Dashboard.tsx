import { useState, useMemo } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { KanbanColumn } from '@/components/KanbanColumn';
import { ContractCard } from '@/components/ContractCard';
import { UploadZone } from '@/components/UploadZone';
import { mockContracts } from '@/data/mockContracts';
import { Contract } from '@/types/contracts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const navigate = useNavigate();

  const { pending, analyzing, completed } = useMemo(() => ({
    pending: contracts.filter(c => c.status === 'pending'),
    analyzing: contracts.filter(c => c.status === 'analyzing'),
    completed: contracts.filter(c => c.status === 'completed')
  }), [contracts]);

  const handleFileSelect = (file: File) => {
    const newContract: Contract = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      status: 'analyzing',
      uploadedAt: new Date(),
      progress: 0
    };

    setContracts(prev => [...prev, newContract]);
    toast.success('Contrat ajouté', {
      description: 'L\'analyse va commencer...'
    });

    // Simulation de l'analyse
    simulateAnalysis(newContract.id);
  };

  const simulateAnalysis = (contractId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Compléter l'analyse
        setTimeout(() => {
          setContracts(prev => prev.map(c => {
            if (c.id === contractId) {
              return {
                ...c,
                status: 'completed',
                analyzedAt: new Date(),
                analysis: {
                  score: Math.floor(Math.random() * 40) + 50,
                  verdict: ['SIGNER', 'NÉGOCIER', 'REFUSER'][Math.floor(Math.random() * 3)] as Contract['analysis']['verdict'],
                  type: 'CDI',
                  resume: 'Analyse terminée avec succès.',
                  clauses: [
                    {
                      id: crypto.randomUUID(),
                      texte: 'Clause exemple détectée.',
                      risque: ['ÉLEVÉ', 'MOYEN', 'FAIBLE'][Math.floor(Math.random() * 3)] as 'ÉLEVÉ' | 'MOYEN' | 'FAIBLE',
                      probleme: 'Point d\'attention identifié.',
                      conseil: 'Vérifiez ce point avant de signer.'
                    }
                  ]
                }
              };
            }
            return c;
          }));
          
          toast.success('Analyse terminée !', {
            description: 'Cliquez sur le contrat pour voir les résultats.'
          });
        }, 500);
      }

      setContracts(prev => prev.map(c => 
        c.id === contractId ? { ...c, progress } : c
      ));
    }, 300);
  };

  const handleContractClick = (contract: Contract) => {
    if (contract.status === 'completed') {
      navigate(`/contrat/${contract.id}`);
    }
  };

  const handleNewContract = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar contracts={contracts} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader 
          title="Tableau de bord" 
          onNewContract={handleNewContract}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Colonne À analyser */}
            <KanbanColumn title="À analyser" count={pending.length + 1} color="todo">
              <UploadZone onFileSelect={handleFileSelect} />
              {pending.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  onClick={() => handleContractClick(contract)}
                />
              ))}
            </KanbanColumn>

            {/* Colonne En cours */}
            <KanbanColumn title="En cours" count={analyzing.length} color="progress">
              {analyzing.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Aucune analyse en cours
                </div>
              ) : (
                analyzing.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract}
                  />
                ))
              )}
            </KanbanColumn>

            {/* Colonne Analysés */}
            <KanbanColumn title="Analysés" count={completed.length} color="done">
              {completed.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  onClick={() => handleContractClick(contract)}
                />
              ))}
            </KanbanColumn>
          </div>
        </main>
      </div>
    </div>
  );
}
