import { cn } from '@/lib/utils';
import { Verdict } from '@/types/contracts';
import { Check, AlertTriangle, X } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const verdictConfig: Record<Verdict, { 
  bg: string; 
  text: string; 
  icon: typeof Check;
}> = {
  'SIGNER': { 
    bg: 'bg-success/10', 
    text: 'text-success', 
    icon: Check,
  },
  'NÉGOCIER': { 
    bg: 'bg-warning/10', 
    text: 'text-warning', 
    icon: AlertTriangle,
  },
  'REFUSER': { 
    bg: 'bg-danger/10', 
    text: 'text-danger', 
    icon: X,
  }
};

const sizeClasses = {
  sm: 'px-2.5 py-1 text-[10px] gap-1',
  md: 'px-3 py-1.5 text-xs gap-1.5',
  lg: 'px-4 py-2 text-sm gap-2'
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 16
};

export function VerdictBadge({ verdict, size = 'md', className }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-lg font-semibold uppercase tracking-wide',
      config.bg,
      config.text,
      sizeClasses[size],
      className
    )}>
      <Icon size={iconSizes[size]} strokeWidth={2.5} />
      {verdict}
    </span>
  );
}
