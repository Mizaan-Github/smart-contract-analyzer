import { useParams, useNavigate } from 'react-router-dom';
import { mockContracts } from '@/data/mockContracts';
import { Button } from '@/components/ui/button';
import { VerdictBadge } from '@/components/VerdictBadge';
import { RiskBadge } from '@/components/RiskBadge';
import { ScoreCircle } from '@/components/ScoreCircle';
import { AIChat } from '@/components/AIChat';
import { ArrowLeft, FileText, Calendar, ChevronRight, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ContractResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  
  const contract = mockContracts.find(c => c.id === id);

  if (!contract || !contract.analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Contrat non trouvé</h1>
          <p className="text-sm text-muted-foreground">Ce contrat n'existe pas ou n'a pas été analysé.</p>
          <Button onClick={() => navigate('/')} className="btn-gradient text-white border-0">
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  const { analysis } = contract;
  const riskyClausesCount = analysis.clauses.filter(c => c.risque === 'ÉLEVÉ').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl hover:bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">{contract.name}</h1>
            <p className="text-xs text-muted-foreground">{contract.fileName}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground chip">
          <Calendar className="w-3.5 h-3.5" />
          {format(contract.analyzedAt!, 'dd MMMM yyyy', { locale: fr })}
        </div>
      </header>

      <div className="flex">
        {/* Contenu principal */}
        <main className="flex-1 p-8 max-w-4xl mx-auto space-y-8">
          {/* Score et Verdict */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-premium p-6 flex items-center gap-6">
              <ScoreCircle score={analysis.score} size="lg" />
              <div className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Score de confiance</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.score >= 70 
                    ? 'Ce contrat présente peu de risques.'
                    : analysis.score >= 50 
                      ? 'Quelques points méritent attention.'
                      : 'Plusieurs clauses sont problématiques.'}
                </p>
              </div>
            </div>

            <div className="card-premium p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center">
                <VerdictBadge verdict={analysis.verdict} size="lg" />
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Recommandation</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.resume}</p>
              </div>
            </div>
          </div>

          {/* Alerte risques */}
          {riskyClausesCount > 0 && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-danger/5 border border-danger/10">
              <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-danger" />
              </div>
              <span className="font-medium text-sm text-danger">
                {riskyClausesCount} clause{riskyClausesCount > 1 ? 's' : ''} à risque élevé détectée{riskyClausesCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Clauses détectées */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">Clauses analysées</h2>
            
            <div className="space-y-3 stagger-children">
              {analysis.clauses.map((clause) => (
                <div 
                  key={clause.id} 
                  className="card-premium overflow-hidden"
                >
                  <button 
                    className="w-full p-5 text-left"
                    onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <RiskBadge level={clause.risque} />
                        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                          {clause.texte}
                        </p>
                      </div>
                      <ChevronRight className={cn(
                        'w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200',
                        expandedClause === clause.id && 'rotate-90'
                      )} />
                    </div>
                  </button>
                  
                  {expandedClause === clause.id && (
                    <div className="px-5 pb-5 pt-0 animate-fade-in">
                      <div className="border-t border-border/50 pt-5 space-y-4">
                        <div className="bg-muted/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                            <FileText className="w-3.5 h-3.5" />
                            EXTRAIT
                          </div>
                          <p className="text-sm text-foreground italic leading-relaxed">"{clause.texte}"</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-danger/5 rounded-xl p-4 border border-danger/10">
                            <div className="flex items-center gap-2 text-xs font-medium text-danger mb-2">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              PROBLÈME
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{clause.probleme}</p>
                          </div>
                          
                          <div className="bg-success/5 rounded-xl p-4 border border-success/10">
                            <div className="flex items-center gap-2 text-xs font-medium text-success mb-2">
                              <Lightbulb className="w-3.5 h-3.5" />
                              CONSEIL
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{clause.conseil}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar Chat IA */}
        <aside className="w-[380px] border-l border-border/50 p-5 hidden lg:block bg-muted/20">
          <AIChat contractName={contract.name} className="h-[calc(100vh-6.5rem)]" />
        </aside>
      </div>
    </div>
  );
}
