import { cn } from '@/lib/utils';
import { Contract } from '@/types/contracts';
import { 
  Home, 
  FileSearch, 
  History, 
  Settings, 
  FileText,
  ChevronLeft
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  contracts: Contract[];
  className?: string;
}

const menuItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: FileSearch, label: 'Mes Analyses', path: '/analyses' },
  { icon: History, label: 'Historique', path: '/historique' },
  { icon: Settings, label: 'Paramètres', path: '/parametres' }
];

const statusColors = {
  completed: {
    safe: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger'
  }
};

function getContractStatusColor(contract: Contract): string {
  if (contract.status !== 'completed' || !contract.analysis) {
    return 'bg-muted-foreground/30';
  }
  const score = contract.analysis.score;
  if (score >= 70) return statusColors.completed.safe;
  if (score >= 50) return statusColors.completed.warning;
  return statusColors.completed.danger;
}

export function AppSidebar({ contracts, className }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const completedContracts = contracts.filter(c => c.status === 'completed');

  return (
    <aside className={cn(
      'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Contr'Act</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          <ChevronLeft className={cn(
            'w-4 h-4 transition-transform',
            collapsed && 'rotate-180'
          )} />
        </Button>
      </div>

      {/* Navigation principale */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Liste des contrats */}
      {!collapsed && completedContracts.length > 0 && (
        <div className="flex-1 p-4 overflow-auto">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Mes Contrats
          </h3>
          <div className="space-y-1">
            {completedContracts.slice(0, 5).map((contract) => (
              <NavLink
                key={contract.id}
                to={`/contrat/${contract.id}`}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <span className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  getContractStatusColor(contract)
                )} />
                <span className="truncate">{contract.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">JD</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Jean Dupont</p>
              <p className="text-xs text-muted-foreground truncate">Compte Pro</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
