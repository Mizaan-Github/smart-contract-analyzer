import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { width: 40, stroke: 3, font: 'text-[11px]' },
  md: { width: 80, stroke: 4.5, font: 'text-xl' },
  lg: { width: 110, stroke: 5.5, font: 'text-3xl' }
};

export function ScoreCircle({ score, size = 'md', className }: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const { strokeClass, textClass, glowClass } = useMemo(() => {
    if (score >= 70) return { strokeClass: 'stroke-success', textClass: 'text-success', glowClass: 'glow-success' };
    if (score >= 50) return { strokeClass: 'stroke-warning', textClass: 'text-warning', glowClass: 'glow-warning' };
    return { strokeClass: 'stroke-danger', textClass: 'text-danger', glowClass: 'glow-danger' };
  }, [score]);

  return (
    <div className={cn('relative flex items-center justify-center', glowClass, className)} 
         style={{ width: config.width, height: config.width }}>
      <svg width={config.width} height={config.width} viewBox={`0 0 ${config.width} ${config.width}`} className="-rotate-90">
        <circle
          cx={config.width / 2} cy={config.width / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth={config.stroke}
          className="text-muted/15"
        />
        <circle
          cx={config.width / 2} cy={config.width / 2} r={radius}
          fill="none" strokeWidth={config.stroke} strokeLinecap="round"
          className={cn(strokeClass, 'transition-all duration-700 ease-out')}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <span className={cn('absolute font-bold', config.font, textClass)}>{score}</span>
    </div>
  );
}
