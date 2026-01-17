import { cn } from '@/lib/utils';
import { Contract } from '@/types/contracts';
import { 
  Home, 
  FileSearch, 
  History, 
  Settings, 
  FileText,
  ChevronLeft,
  Sparkles
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

function getContractStatusColor(contract: Contract): string {
  if (contract.status !== 'completed' || !contract.analysis) {
    return 'bg-muted-foreground/20';
  }
  const score = contract.analysis.score;
  if (score >= 70) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

export function AppSidebar({ contracts, className }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const completedContracts = contracts.filter(c => c.status === 'completed');

  return (
    <aside className={cn(
      'h-screen bg-sidebar flex flex-col transition-all duration-300 ease-out relative',
      collapsed ? 'w-[72px]' : 'w-72',
      className
    )}>
      {/* Subtle border */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      
      {/* Logo */}
      <div className={cn(
        'h-16 flex items-center justify-between px-4 transition-all duration-300',
        collapsed && 'justify-center'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Contr'Act</span>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className="px-3 mb-2">
        <div className="divider" />
      </div>

      {/* Navigation principale */}
      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item group',
                isActive && 'active'
              )}
            >
              <item.icon className={cn(
                'w-[18px] h-[18px] shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              {!collapsed && (
                <span className={cn(
                  'text-sm transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Liste des contrats */}
      {!collapsed && completedContracts.length > 0 && (
        <div className="flex-1 px-4 py-6 overflow-auto scrollbar-thin">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">
            Mes Contrats
          </h3>
          <div className="space-y-0.5 stagger-children">
            {completedContracts.slice(0, 5).map((contract) => (
              <NavLink
                key={contract.id}
                to={`/contrat/${contract.id}`}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-200',
                  isActive 
                    ? 'bg-primary/8 text-foreground' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0 transition-transform',
                  getContractStatusColor(contract)
                )} />
                <span className="truncate">{contract.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div className="mt-auto px-3 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9',
            collapsed && 'justify-center px-0'
          )}
        >
          <ChevronLeft className={cn(
            'w-4 h-4 transition-transform duration-300',
            collapsed && 'rotate-180'
          )} />
          {!collapsed && <span className="text-xs">Réduire</span>}
        </Button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/10">
              <span className="text-sm font-semibold text-primary">JD</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Jean Dupont</p>
              <p className="text-[11px] text-muted-foreground">Plan Pro</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
