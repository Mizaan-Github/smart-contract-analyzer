import { cn } from '@/lib/utils';
import { Contract } from '@/types/contracts';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card 
      className={cn(
        'card-hover cursor-pointer bg-card shadow-card overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header avec nom et statut */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate text-sm">
                {contract.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
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
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Clock className="w-4 h-4" />
            <span>En attente d'analyse</span>
          </div>
        )}

        {contract.status === 'analyzing' && (
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 text-primary text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyse en cours...</span>
            </div>
            <Progress value={contract.progress || 0} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
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
              <div className="flex items-center gap-1.5 text-warning text-xs mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{riskyClausesCount} clause{riskyClausesCount > 1 ? 's' : ''} à risque</span>
              </div>
            )}
            
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Analysé le {format(contract.analyzedAt!, 'dd MMM yyyy', { locale: fr })}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
