import { cn } from '@/lib/utils';
import { Contract } from '@/types/contracts';
import { VerdictBadge } from './VerdictBadge';
import { ScoreCircle } from './ScoreCircle';
import { FileText, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';

interface ContractCardProps {
  contract: Contract;
  onClick?: () => void;
  className?: string;
}

export function ContractCard({ contract, onClick, className }: ContractCardProps) {
  const riskyCount = contract.analysis?.clauses.filter(c => c.risque === 'ÉLEVÉ').length || 0;
  
  return (
    <div className={cn('card-minimal p-3.5 cursor-pointer', className)} onClick={onClick}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/6 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-primary/70" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-medium text-foreground truncate leading-tight">
              {contract.name}
            </h4>
            <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
              {contract.fileName}
            </p>
          </div>
        </div>
        
        {contract.status === 'completed' && contract.analysis && (
          <ScoreCircle score={contract.analysis.score} size="sm" />
        )}
      </div>

      {contract.status === 'pending' && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 py-2 px-2.5 bg-muted/30 rounded-lg">
          <Clock className="w-3 h-3" />
          <span>En attente</span>
        </div>
      )}

      {contract.status === 'analyzing' && (
        <div className="space-y-2 py-1">
          <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyse...</span>
          </div>
          <Progress value={contract.progress || 0} className="h-1" />
        </div>
      )}

      {contract.status === 'completed' && contract.analysis && (
        <>
          <VerdictBadge verdict={contract.analysis.verdict} size="sm" />
          
          {riskyCount > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-warning font-medium mt-2 px-2 py-1 bg-warning/6 rounded w-fit">
              <AlertTriangle className="w-3 h-3" />
              <span>{riskyCount} risque{riskyCount > 1 ? 's' : ''}</span>
            </div>
          )}
          
          <p className="text-[10px] text-muted-foreground/60 mt-2.5 pt-2.5 border-t border-border/40">
            {format(contract.analyzedAt!, 'dd MMM yyyy', { locale: fr })}
          </p>
        </>
      )}
    </div>
  );
}
