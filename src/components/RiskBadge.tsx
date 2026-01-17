import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/contracts';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  'ÉLEVÉ': { bg: 'bg-danger/10', text: 'text-danger', label: 'Risque élevé' },
  'MOYEN': { bg: 'bg-warning/10', text: 'text-warning', label: 'Risque moyen' },
  'FAIBLE': { bg: 'bg-success/10', text: 'text-success', label: 'Risque faible' }
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
