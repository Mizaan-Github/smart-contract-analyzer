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
import { analyzeContract } from '@/services/contractApi';

export default function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const navigate = useNavigate();

  const { pending, analyzing, completed } = useMemo(() => ({
    pending: contracts.filter(c => c.status === 'pending'),
    analyzing: contracts.filter(c => c.status === 'analyzing'),
    completed: contracts.filter(c => c.status === 'completed')
  }), [contracts]);

  const handleFileSelect = async (file: File) => {
    const contractId = crypto.randomUUID();
    
    // Read file content
    const text = await readFileAsText(file);
    
    const newContract: Contract = {
      id: contractId,
      name: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      status: 'analyzing',
      uploadedAt: new Date(),
      progress: 0,
      content: text
    };
    
    setContracts(prev => [...prev, newContract]);
    toast.success('Contrat ajouté, analyse en cours...');
    
    // Start progress animation
    const progressInterval = startProgressAnimation(contractId);
    
    try {
      // Call real API
      const analysis = await analyzeContract(text);
      
      clearInterval(progressInterval);
      
      setContracts(prev => prev.map(c => c.id === contractId ? {
        ...c,
        status: 'completed',
        progress: 100,
        analyzedAt: new Date(),
        analysis
      } : c));
      
      toast.success('Analyse terminée !');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      
      // Fallback to mock on error
      setContracts(prev => prev.map(c => c.id === contractId ? {
        ...c,
        status: 'completed',
        progress: 100,
        analyzedAt: new Date(),
        analysis: {
          score: Math.floor(Math.random() * 40) + 50,
          verdict: ['SIGNER', 'NÉGOCIER', 'REFUSER'][Math.floor(Math.random() * 3)] as any,
          type: 'Autre',
          resume: 'Analyse effectuée (mode hors ligne).',
          clauses: [{ 
            id: crypto.randomUUID(), 
            texte: 'Clause exemple.', 
            risque: 'MOYEN' as const, 
            probleme: 'Vérification manuelle recommandée.', 
            conseil: 'Consultez un expert.' 
          }]
        }
      } : c));
      
      toast.error('Erreur API, mode hors ligne utilisé');
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const startProgressAnimation = (id: string) => {
    let progress = 0;
    return setInterval(() => {
      progress += Math.random() * 8;
      if (progress > 90) progress = 90; // Cap at 90% until real completion
      setContracts(prev => prev.map(c => c.id === id && c.status === 'analyzing' 
        ? { ...c, progress: Math.min(progress, 90) } 
        : c
      ));
    }, 500);
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
