import { cn } from '@/lib/utils';
import { Contract } from '@/types/contracts';
import { 
  Home, 
  FileSearch, 
  History, 
  Settings, 
  Sparkles,
  PanelLeftClose
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface AppSidebarProps {
  contracts: Contract[];
  className?: string;
}

const menuItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: FileSearch, label: 'Analyses', path: '/analyses' },
  { icon: History, label: 'Historique', path: '/historique' },
  { icon: Settings, label: 'Paramètres', path: '/parametres' }
];

function getStatusDot(contract: Contract): string {
  if (contract.status !== 'completed' || !contract.analysis) return 'bg-muted-foreground/25';
  const score = contract.analysis.score;
  if (score >= 70) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

export function AppSidebar({ contracts, className }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const completed = contracts.filter(c => c.status === 'completed');

  return (
    <aside className={cn(
      'h-screen bg-sidebar flex flex-col transition-all duration-300 ease-out relative',
      collapsed ? 'w-[68px]' : 'w-[260px]',
      className
    )}>
      {/* Border */}
      <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-sidebar-border to-transparent" />
      
      {/* Logo */}
      <div className={cn(
        'h-[60px] flex items-center px-4 transition-all duration-300',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-[15px] text-foreground">Contr'Act</span>
        )}
      </div>

      {/* Nav */}
      <nav className="px-3 mt-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn('nav-clean', isActive && 'active')}
            >
              <item.icon className={cn(
                'w-[17px] h-[17px] shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )} />
              {!collapsed && (
                <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Contracts list */}
      {!collapsed && completed.length > 0 && (
        <div className="flex-1 px-4 pt-6 pb-4 overflow-auto scroll-minimal">
          <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.1em] mb-2 px-1">
            Récents
          </p>
          <div className="space-y-0.5 stagger">
            {completed.slice(0, 4).map((contract) => (
              <NavLink
                key={contract.id}
                to={`/contrat/${contract.id}`}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-all',
                  isActive 
                    ? 'bg-primary/6 text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', getStatusDot(contract))} />
                <span className="truncate">{contract.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Toggle & User */}
      <div className="mt-auto">
        <div className="px-3 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/40 transition-all',
              collapsed && 'justify-center'
            )}
          >
            <PanelLeftClose className={cn(
              'w-3.5 h-3.5 transition-transform duration-300',
              collapsed && 'rotate-180'
            )} />
            {!collapsed && <span>Réduire</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-primary">JD</span>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-foreground truncate">Jean Dupont</p>
                <p className="text-[10px] text-muted-foreground/70">Pro</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
