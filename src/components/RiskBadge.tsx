import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/contracts';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string }> = {
  'ÉLEVÉ': { bg: 'bg-danger/10', text: 'text-danger' },
  'MOYEN': { bg: 'bg-warning/10', text: 'text-warning' },
  'FAIBLE': { bg: 'bg-success/10', text: 'text-success' }
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  
  return (
    <span className={cn(
      'risk-badge',
      config.bg,
      config.text,
      className
    )}>
      {level}
    </span>
  );
}
