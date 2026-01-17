import { useMemo, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { Contract } from '@/types/contracts';
import { useNavigate } from 'react-router-dom';
import { VerdictBadge } from '@/components/VerdictBadge';
import { ScoreCircle } from '@/components/ScoreCircle';
import { FileText, AlertTriangle, Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useContracts } from '@/contexts/ContractsContext';

export default function Analyses() {
  const { contracts } = useContracts();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterVerdict, setFilterVerdict] = useState<string | null>(null);
  const navigate = useNavigate();

  const completedContracts = useMemo(() => 
    contracts.filter(c => c.status === 'completed' && c.analysis),
  [contracts]);

  const filteredContracts = useMemo(() => {
    let result = completedContracts;
    
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterVerdict) {
      result = result.filter(c => c.analysis?.verdict === filterVerdict);
    }
    
    return result;
  }, [completedContracts, searchQuery, filterVerdict]);

  const stats = useMemo(() => ({
    total: completedContracts.length,
    signer: completedContracts.filter(c => c.analysis?.verdict === 'SIGNER').length,
    negocier: completedContracts.filter(c => c.analysis?.verdict === 'NÉGOCIER').length,
    refuser: completedContracts.filter(c => c.analysis?.verdict === 'REFUSER').length,
  }), [completedContracts]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar contracts={contracts} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader title="Mes Analyses" />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                label="Total" 
                value={stats.total} 
                color="primary"
                onClick={() => setFilterVerdict(null)}
                active={!filterVerdict}
              />
              <StatCard 
                label="À signer" 
                value={stats.signer} 
                color="success"
                onClick={() => setFilterVerdict(filterVerdict === 'SIGNER' ? null : 'SIGNER')}
                active={filterVerdict === 'SIGNER'}
              />
              <StatCard 
                label="À négocier" 
                value={stats.negocier} 
                color="warning"
                onClick={() => setFilterVerdict(filterVerdict === 'NÉGOCIER' ? null : 'NÉGOCIER')}
                active={filterVerdict === 'NÉGOCIER'}
              />
              <StatCard 
                label="À refuser" 
                value={stats.refuser} 
                color="danger"
                onClick={() => setFilterVerdict(filterVerdict === 'REFUSER' ? null : 'REFUSER')}
                active={filterVerdict === 'REFUSER'}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-clean pl-9 w-full"
                />
              </div>
              
              <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'grid' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contracts */}
            {filteredContracts.length === 0 ? (
              <div className="card-minimal p-12 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Aucune analyse trouvée</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {filteredContracts.map((contract) => (
                  <ContractGridCard 
                    key={contract.id} 
                    contract={contract} 
                    onClick={() => navigate(`/contrat/${contract.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="card-minimal divide-y divide-border/50">
                {filteredContracts.map((contract) => (
                  <ContractListItem 
                    key={contract.id} 
                    contract={contract} 
                    onClick={() => navigate(`/contrat/${contract.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  color, 
  onClick, 
  active 
}: { 
  label: string; 
  value: number; 
  color: 'primary' | 'success' | 'warning' | 'danger';
  onClick: () => void;
  active: boolean;
}) {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'card-minimal p-4 text-left transition-all',
        active && 'ring-1 ring-primary/30'
      )}
    >
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </button>
  );
}

function ContractGridCard({ contract, onClick }: { contract: Contract; onClick: () => void }) {
  const risks = contract.analysis?.clauses?.filter(c => c.risque === 'ÉLEVÉ').length || 0;

  return (
    <button
      onClick={onClick}
      className="card-minimal p-4 text-left w-full transition-all hover:shadow-md group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{contract.name}</p>
            <p className="text-[11px] text-muted-foreground">{contract.analysis?.type || 'Contrat'}</p>
          </div>
        </div>
        <ScoreCircle score={contract.analysis?.score || 0} size="sm" />
      </div>

      <div className="flex items-center justify-between">
        <VerdictBadge verdict={contract.analysis?.verdict || 'NÉGOCIER'} size="sm" />
        
        {risks > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-danger">
            <AlertTriangle className="w-3 h-3" />
            <span>{risks} risque{risks > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {contract.analyzedAt && (
        <p className="text-[10px] text-muted-foreground/60 mt-3 pt-3 border-t border-border/30">
          {format(contract.analyzedAt, "d MMM yyyy", { locale: fr })}
        </p>
      )}
    </button>
  );
}

function ContractListItem({ contract, onClick }: { contract: Contract; onClick: () => void }) {
  const risks = contract.analysis?.clauses?.filter(c => c.risque === 'ÉLEVÉ').length || 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{contract.name}</p>
        <p className="text-[11px] text-muted-foreground">{contract.analysis?.type || 'Contrat'}</p>
      </div>

      <VerdictBadge verdict={contract.analysis?.verdict || 'NÉGOCIER'} size="sm" />
      
      {risks > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-danger shrink-0">
          <AlertTriangle className="w-3 h-3" />
          <span>{risks}</span>
        </div>
      )}

      <ScoreCircle score={contract.analysis?.score || 0} size="sm" />

      {contract.analyzedAt && (
        <p className="text-[11px] text-muted-foreground/60 shrink-0 w-20 text-right">
          {format(contract.analyzedAt, "d MMM", { locale: fr })}
        </p>
      )}
    </button>
  );
}
