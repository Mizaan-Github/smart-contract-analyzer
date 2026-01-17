import { useParams, useNavigate } from 'react-router-dom';
import { mockContracts } from '@/data/mockContracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerdictBadge } from '@/components/VerdictBadge';
import { RiskBadge } from '@/components/RiskBadge';
import { ScoreCircle } from '@/components/ScoreCircle';
import { AIChat } from '@/components/AIChat';
import { ArrowLeft, FileText, Calendar, ChevronRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

export default function ContractResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  
  const contract = mockContracts.find(c => c.id === id);

  if (!contract || !contract.analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Contrat non trouvé</h1>
          <p className="text-muted-foreground mb-4">Ce contrat n'existe pas ou n'a pas encore été analysé.</p>
          <Button onClick={() => navigate('/')}>Retour au tableau de bord</Button>
        </div>
      </div>
    );
  }

  const { analysis } = contract;
  const riskyClausesCount = analysis.clauses.filter(c => c.risque === 'ÉLEVÉ').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-card border-b border-border px-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold">{contract.name}</h1>
            <p className="text-sm text-muted-foreground">{contract.fileName}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Analysé le {format(contract.analyzedAt!, 'dd MMMM yyyy', { locale: fr })}
        </div>
      </header>

      <div className="flex">
        {/* Contenu principal */}
        <main className="flex-1 p-6 space-y-6">
          {/* Score et Verdict */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card shadow-card">
              <CardContent className="p-6 flex items-center gap-6">
                <ScoreCircle score={analysis.score} size="lg" />
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Score de confiance</h2>
                  <p className="text-sm text-muted-foreground">
                    {analysis.score >= 70 
                      ? 'Ce contrat présente peu de risques.'
                      : analysis.score >= 50 
                        ? 'Quelques points méritent votre attention.'
                        : 'Attention, plusieurs clauses sont problématiques.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-card">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
                  <VerdictBadge verdict={analysis.verdict} size="lg" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Notre recommandation</h2>
                  <p className="text-sm text-muted-foreground">{analysis.resume}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé des risques */}
          {riskyClausesCount > 0 && (
            <Card className="bg-danger/5 border-danger/20">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <span className="font-medium text-danger">
                  {riskyClausesCount} clause{riskyClausesCount > 1 ? 's' : ''} à risque élevé détectée{riskyClausesCount > 1 ? 's' : ''}
                </span>
              </CardContent>
            </Card>
          )}

          {/* Clauses détectées */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Clauses analysées</h2>
            
            {analysis.clauses.map((clause) => (
              <Card 
                key={clause.id} 
                className="bg-card shadow-card card-hover overflow-hidden"
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <RiskBadge level={clause.risque} />
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {clause.texte}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedClause === clause.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </CardHeader>
                
                {expandedClause === clause.id && (
                  <CardContent className="pt-0 pb-4 animate-fade-in">
                    <div className="border-t border-border pt-4 space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">📌 Extrait</h4>
                        <p className="text-sm text-muted-foreground italic">"{clause.texte}"</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-danger/5 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-danger mb-2">⚠️ Problème identifié</h4>
                          <p className="text-sm text-foreground">{clause.probleme}</p>
                        </div>
                        
                        <div className="bg-success/5 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-success mb-2">💡 Notre conseil</h4>
                          <p className="text-sm text-foreground">{clause.conseil}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </main>

        {/* Sidebar Chat IA */}
        <aside className="w-96 border-l border-border p-4 hidden lg:block">
          <AIChat contractName={contract.name} className="h-[calc(100vh-6rem)]" />
        </aside>
      </div>
    </div>
  );
}
