import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/contracts';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const config: Record<RiskLevel, { bg: string; text: string }> = {
  'ÉLEVÉ': { bg: 'bg-danger/8', text: 'text-danger' },
  'MOYEN': { bg: 'bg-warning/8', text: 'text-warning' },
  'FAIBLE': { bg: 'bg-success/8', text: 'text-success' }
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const { bg, text } = config[level];
  return (
    <span className={cn('badge-minimal', bg, text, className)}>{level}</span>
  );
}
