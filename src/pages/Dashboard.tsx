import { useMemo } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { KanbanColumn } from '@/components/KanbanColumn';
import { ContractCard } from '@/components/ContractCard';
import { UploadZone } from '@/components/UploadZone';
import { Contract } from '@/types/contracts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { analyzeContract, extractTextFromFile } from '@/services/featherlessApi';
import { useContracts } from '@/contexts/ContractsContext';

export default function Dashboard() {
  const { contracts, addContract, updateContract, setContractText } = useContracts();
  const navigate = useNavigate();

  const { pending, analyzing, completed } = useMemo(() => ({
    pending: contracts.filter(c => c.status === 'pending'),
    analyzing: contracts.filter(c => c.status === 'analyzing'),
    completed: contracts.filter(c => c.status === 'completed')
  }), [contracts]);

  const handleFileSelect = async (file: File) => {
    const newContract: Contract = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      status: 'analyzing',
      uploadedAt: new Date(),
      progress: 0
    };
    
    addContract(newContract);
    toast.info('Extraction du texte en cours...');

    // Start progress simulation
    const progressInterval = startProgressSimulation(newContract.id);

    try {
      // Extract text from file
      const text = await extractTextFromFile(file);
      setContractText(newContract.id, text);
      
      updateContract(newContract.id, { progress: 40 });
      toast.info('Analyse IA en cours...');
      
      // Analyze with AI
      const analysis = await analyzeContract(text);
      
      clearInterval(progressInterval);
      
      // Update contract with analysis
      updateContract(newContract.id, {
        status: 'completed',
        progress: 100,
        analyzedAt: new Date(),
        analysis
      });
      
      toast.success('Analyse terminée !');
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
      
      // Mark as pending on failure
      updateContract(newContract.id, { status: 'pending', progress: 0 });
    }
  };

  const startProgressSimulation = (id: string) => {
    let progress = 10;
    return setInterval(() => {
      progress += Math.random() * 8;
      if (progress < 85) {
        updateContract(id, { progress });
      }
    }, 600);
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
