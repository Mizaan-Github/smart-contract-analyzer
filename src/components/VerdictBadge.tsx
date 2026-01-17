import { cn } from '@/lib/utils';
import { Verdict } from '@/types/contracts';
import { Check, AlertTriangle, X } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const config: Record<Verdict, { bg: string; text: string; Icon: typeof Check }> = {
  'SIGNER': { bg: 'bg-success/8', text: 'text-success', Icon: Check },
  'NÉGOCIER': { bg: 'bg-warning/8', text: 'text-warning', Icon: AlertTriangle },
  'REFUSER': { bg: 'bg-danger/8', text: 'text-danger', Icon: X }
};

const sizes = {
  sm: 'px-2 py-0.5 text-[9px] gap-0.5',
  md: 'px-2.5 py-1 text-[10px] gap-1',
  lg: 'px-3 py-1.5 text-[11px] gap-1.5'
};

const iconSizes = { sm: 9, md: 11, lg: 13 };

export function VerdictBadge({ verdict, size = 'md', className }: VerdictBadgeProps) {
  const { bg, text, Icon } = config[verdict];
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-md font-semibold uppercase tracking-wide',
      bg, text, sizes[size], className
    )}>
      <Icon size={iconSizes[size]} strokeWidth={2.5} />
      {verdict}
    </span>
  );
}
