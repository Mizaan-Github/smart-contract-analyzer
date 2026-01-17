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
  const riskyClausesCount = contract.analysis?.clauses.filter(c => c.risque === 'ÉLEVÉ').length || 0;
  
  return (
    <div 
      className={cn(
        'card-premium p-4 cursor-pointer group',
        className
      )}
      onClick={onClick}
    >
      {/* Header avec nom et statut */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-foreground truncate text-sm leading-tight">
              {contract.name}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {contract.fileName}
            </p>
          </div>
        </div>
        
        {contract.status === 'completed' && contract.analysis && (
          <ScoreCircle score={contract.analysis.score} size="sm" />
        )}
      </div>

      {/* Contenu selon le statut */}
      {contract.status === 'pending' && (
        <div className="flex items-center gap-2 text-muted-foreground text-xs py-3 px-3 bg-muted/30 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>En attente d'analyse</span>
        </div>
      )}

      {contract.status === 'analyzing' && (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-primary text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyse en cours...</span>
          </div>
          <Progress value={contract.progress || 0} className="h-1.5" />
          <p className="text-[10px] text-muted-foreground text-right font-medium">
            {contract.progress || 0}%
          </p>
        </div>
      )}

      {contract.status === 'completed' && contract.analysis && (
        <>
          <div className="mb-3">
            <VerdictBadge verdict={contract.analysis.verdict} size="sm" />
          </div>
          
          {riskyClausesCount > 0 && (
            <div className="flex items-center gap-1.5 text-warning text-[11px] font-medium mb-3 px-2 py-1.5 bg-warning/5 rounded-lg w-fit">
              <AlertTriangle className="w-3 h-3" />
              <span>{riskyClausesCount} clause{riskyClausesCount > 1 ? 's' : ''} à risque</span>
            </div>
          )}
          
          <div className="pt-3 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground">
              {format(contract.analyzedAt!, 'dd MMM yyyy', { locale: fr })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
