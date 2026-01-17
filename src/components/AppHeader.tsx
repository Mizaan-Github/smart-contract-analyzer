import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Plus } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showNewButton?: boolean;
  onNewContract?: () => void;
  className?: string;
}

export function AppHeader({ title, showNewButton = true, onNewContract, className }: AppHeaderProps) {
  return (
    <header className={cn(
      'h-16 bg-card border-b border-border px-6 flex items-center justify-between gap-4',
      className
    )}>
      {/* Titre */}
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Barre de recherche */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contrat..."
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Bouton nouveau contrat */}
        {showNewButton && (
          <Button onClick={onNewContract} className="gap-2 gradient-primary border-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau contrat</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </Button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">JD</span>
        </div>
      </div>
    </header>
  );
}
