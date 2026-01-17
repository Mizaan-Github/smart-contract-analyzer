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
      'h-14 glass-clean px-5 flex items-center justify-between gap-6 sticky top-0 z-10',
      className
    )}>
      <div>
        <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground/70">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Rechercher..."
            className="w-48 h-8 pl-8 input-clean text-[12px]"
          />
        </div>

        {showNewButton && (
          <Button 
            onClick={onNewContract} 
            className="h-8 px-3 gap-1.5 gradient-primary text-white border-0 rounded-lg text-[12px] font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouveau</span>
          </Button>
        )}

        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/15 transition-colors">
          <span className="text-[11px] font-semibold text-primary">JD</span>
        </div>
      </div>
    </header>
  );
}
