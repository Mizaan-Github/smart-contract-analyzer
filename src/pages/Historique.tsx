import { useMemo } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { Contract } from '@/types/contracts';
import { useNavigate } from 'react-router-dom';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ScoreCircle } from '@/components/ScoreCircle';
import { FileText, Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useContracts } from '@/contexts/ContractsContext';

type TimeGroup = 'today' | 'yesterday' | 'week' | 'month' | 'older';

function getTimeGroup(date: Date): TimeGroup {
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';
  if (isThisWeek(date)) return 'week';
  if (isThisMonth(date)) return 'month';
  return 'older';
}

const groupLabels: Record<TimeGroup, string> = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  week: 'Cette semaine',
  month: 'Ce mois',
  older: 'Plus ancien'
};

export default function Historique() {
  const { contracts } = useContracts();
  const navigate = useNavigate();

  const allContracts = useMemo(() => 
    contracts.filter(c => c.status === 'completed' || c.analyzedAt || c.uploadedAt)
      .sort((a, b) => {
        const dateA = a.analyzedAt || a.uploadedAt;
        const dateB = b.analyzedAt || b.uploadedAt;
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      }),
  [contracts]);

  const groupedContracts = useMemo(() => {
    const groups: Record<TimeGroup, Contract[]> = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: []
    };

    allContracts.forEach(contract => {
      const date = contract.analyzedAt || contract.uploadedAt;
      if (date) {
        const group = getTimeGroup(date);
        groups[group].push(contract);
      }
    });

    return groups;
  }, [allContracts]);

  const activeGroups = (Object.keys(groupedContracts) as TimeGroup[])
    .filter(key => groupedContracts[key].length > 0);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar contracts={contracts} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader title="Historique" />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {activeGroups.length === 0 ? (
              <div className="card-minimal p-12 text-center">
                <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Aucun historique</p>
              </div>
            ) : (
              activeGroups.map((group) => (
                <div key={group} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                    <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      {groupLabels[group]}
                    </h3>
                    <span className="text-[10px] text-muted-foreground/50">
                      ({groupedContracts[group].length})
                    </span>
                  </div>
                  
                  <div className="card-minimal divide-y divide-border/40 overflow-hidden">
                    {groupedContracts[group].map((contract) => (
                      <HistoryItem 
                        key={contract.id} 
                        contract={contract}
                        onClick={() => contract.status === 'completed' && navigate(`/contrat/${contract.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function HistoryItem({ contract, onClick }: { contract: Contract; onClick: () => void }) {
  const date = contract.analyzedAt || contract.uploadedAt;
  const isCompleted = contract.status === 'completed';

  return (
    <button
      onClick={onClick}
      disabled={!isCompleted}
      className={cn(
        'w-full flex items-center gap-4 p-4 text-left transition-all',
        isCompleted ? 'hover:bg-muted/30 cursor-pointer' : 'opacity-60 cursor-default'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
        isCompleted ? 'bg-primary/8' : 'bg-muted/50'
      )}>
        <FileText className={cn(
          'w-4 h-4',
          isCompleted ? 'text-primary' : 'text-muted-foreground'
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{contract.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">
            {contract.status === 'pending' && 'En attente'}
            {contract.status === 'analyzing' && 'Analyse en cours...'}
            {contract.status === 'completed' && (contract.analysis?.type || 'Contrat')}
          </span>
          {date && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60">
                {format(date, "HH:mm", { locale: fr })}
              </span>
            </>
          )}
        </div>
      </div>

      {isCompleted && contract.analysis && (
        <>
          <VerdictBadge verdict={contract.analysis.verdict} size="sm" />
          <ScoreCircle score={contract.analysis.score} size="sm" />
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
        </>
      )}
    </button>
  );
}
