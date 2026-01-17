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
    toast.success('Contrat ajouté');
    simulateAnalysis(newContract.id);
  };

  const simulateAnalysis = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setContracts(prev => prev.map(c => c.id === id ? {
            ...c,
            status: 'completed',
            analyzedAt: new Date(),
            analysis: {
              score: Math.floor(Math.random() * 40) + 50,
              verdict: ['SIGNER', 'NÉGOCIER', 'REFUSER'][Math.floor(Math.random() * 3)] as any,
              type: 'CDI',
              resume: 'Analyse terminée.',
              clauses: [{ id: crypto.randomUUID(), texte: 'Clause exemple.', risque: 'MOYEN' as const, probleme: 'Attention.', conseil: 'Vérifiez.' }]
            }
          } : c));
          toast.success('Analyse terminée');
        }, 400);
      }
      setContracts(prev => prev.map(c => c.id === id ? { ...c, progress: Math.min(progress, 100) } : c));
    }, 280);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar contracts={contracts} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader title="Tableau de bord" onNewContract={() => document.getElementById('file-upload')?.click()} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <KanbanColumn title="À analyser" count={pending.length + 1} color="todo">
              <UploadZone onFileSelect={handleFileSelect} />
              {pending.map(c => <ContractCard key={c.id} contract={c} />)}
            </KanbanColumn>

            <KanbanColumn title="En cours" count={analyzing.length} color="progress">
              {analyzing.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-[12px] text-muted-foreground/60 rounded-2xl border border-dashed border-border/60">
                  Aucune analyse
                </div>
              ) : analyzing.map(c => <ContractCard key={c.id} contract={c} />)}
            </KanbanColumn>

            <KanbanColumn title="Analysés" count={completed.length} color="done">
              {completed.map(c => <ContractCard key={c.id} contract={c} onClick={() => navigate(`/contrat/${c.id}`)} />)}
            </KanbanColumn>
          </div>
        </main>
      </div>
    </div>
  );
}
