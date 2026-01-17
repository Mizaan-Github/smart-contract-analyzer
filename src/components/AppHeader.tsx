import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Plus } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showNewButton?: boolean;
  onNewContract?: () => void;
  className?: string;
}

export function AppHeader({ title, subtitle, showNewButton = true, onNewContract, className }: AppHeaderProps) {
  return (
    <header className={cn(
      'h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 flex items-center justify-between gap-6 sticky top-0 z-10',
      className
    )}>
      {/* Titre */}
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Barre de recherche */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            placeholder="Rechercher..."
            className="w-56 pl-10 h-9 input-refined text-sm"
          />
        </div>

        {/* Bouton nouveau contrat */}
        {showNewButton && (
          <Button 
            onClick={onNewContract} 
            className="gap-2 btn-gradient text-white border-0 h-9 px-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Nouveau</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted/50">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
        </Button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/10 cursor-pointer hover:ring-primary/20 transition-all">
          <span className="text-sm font-semibold text-primary">JD</span>
        </div>
      </div>
    </header>
  );
}
