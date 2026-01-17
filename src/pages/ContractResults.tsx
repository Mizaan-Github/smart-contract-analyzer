import { useParams, useNavigate } from 'react-router-dom';
import { mockContracts } from '@/data/mockContracts';
import { Button } from '@/components/ui/button';
import { VerdictBadge } from '@/components/VerdictBadge';
import { RiskBadge } from '@/components/RiskBadge';
import { ScoreCircle } from '@/components/ScoreCircle';
import { AIChat } from '@/components/AIChat';
import { ArrowLeft, FileText, Calendar, ChevronRight, AlertTriangle, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ContractResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const contract = mockContracts.find(c => c.id === id);

  if (!contract || !contract.analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-[13px] text-muted-foreground">Contrat non trouvé</p>
          <Button onClick={() => navigate('/')} size="sm" className="gradient-primary text-white border-0">Retour</Button>
        </div>
      </div>
    );
  }

  const { analysis } = contract;
  const riskyCount = analysis.clauses.filter(c => c.risque === 'ÉLEVÉ').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 glass-clean px-5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[14px] font-semibold text-foreground truncate">{contract.name}</h1>
          <p className="text-[10px] text-muted-foreground/70 truncate">{contract.fileName}</p>
        </div>
        <span className="ml-auto badge-minimal bg-muted/50 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {format(contract.analyzedAt!, 'dd MMM yyyy', { locale: fr })}
        </span>
      </header>

      <div className="flex">
        <main className="flex-1 p-6 max-w-3xl mx-auto space-y-5">
          {/* Score & Verdict */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-minimal p-5 flex items-center gap-5">
              <ScoreCircle score={analysis.score} size="md" />
              <div>
                <h2 className="text-[13px] font-semibold text-foreground mb-1">Score</h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {analysis.score >= 70 ? 'Peu de risques.' : analysis.score >= 50 ? 'Points d\'attention.' : 'Clauses problématiques.'}
                </p>
              </div>
            </div>

            <div className="card-minimal p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-muted/30 flex items-center justify-center">
                <VerdictBadge verdict={analysis.verdict} size="lg" />
              </div>
              <div>
                <h2 className="text-[13px] font-semibold text-foreground mb-1">Recommandation</h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{analysis.resume}</p>
              </div>
            </div>
          </div>

          {riskyCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-danger/5 border border-danger/10">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-[12px] font-medium text-danger">{riskyCount} clause{riskyCount > 1 ? 's' : ''} à risque élevé</span>
            </div>
          )}

          {/* Clauses */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-foreground">Clauses analysées</h2>
            
            <div className="space-y-2 stagger">
              {analysis.clauses.map((clause) => (
                <div key={clause.id} className="card-minimal overflow-hidden">
                  <button 
                    className="w-full p-4 text-left"
                    onClick={() => setExpanded(expanded === clause.id ? null : clause.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <RiskBadge level={clause.risque} />
                        <p className="text-[12px] text-foreground leading-relaxed line-clamp-2">{clause.texte}</p>
                      </div>
                      <ChevronRight className={cn(
                        'w-4 h-4 text-muted-foreground shrink-0 transition-transform',
                        expanded === clause.id && 'rotate-90'
                      )} />
                    </div>
                  </button>
                  
                  {expanded === clause.id && (
                    <div className="px-4 pb-4 pt-0 animate-fadeIn">
                      <div className="border-t border-border/40 pt-4 space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-danger/4 rounded-xl p-3 border border-danger/8">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-danger mb-1.5">
                              <AlertTriangle className="w-3 h-3" />
                              PROBLÈME
                            </div>
                            <p className="text-[11px] text-foreground leading-relaxed">{clause.probleme}</p>
                          </div>
                          
                          <div className="bg-success/4 rounded-xl p-3 border border-success/8">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-success mb-1.5">
                              <Lightbulb className="w-3 h-3" />
                              CONSEIL
                            </div>
                            <p className="text-[11px] text-foreground leading-relaxed">{clause.conseil}</p>
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

        <aside className="w-[340px] border-l border-border/40 p-4 hidden lg:block bg-muted/10">
          <AIChat contractName={contract.name} className="h-[calc(100vh-5rem)]" />
        </aside>
      </div>
    </div>
  );
}
