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
  label: string;
}> = {
  'SIGNER': { 
    bg: 'bg-success', 
    text: 'text-success-foreground', 
    icon: Check,
    label: 'Signer' 
  },
  'NÉGOCIER': { 
    bg: 'bg-warning', 
    text: 'text-warning-foreground', 
    icon: AlertTriangle,
    label: 'Négocier' 
  },
  'REFUSER': { 
    bg: 'bg-danger', 
    text: 'text-danger-foreground', 
    icon: X,
    label: 'Refuser' 
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2'
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18
};

export function VerdictBadge({ verdict, size = 'md', className }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-semibold',
      config.bg,
      config.text,
      sizeClasses[size],
      className
    )}>
      <Icon size={iconSizes[size]} />
      {verdict}
    </span>
  );
}
