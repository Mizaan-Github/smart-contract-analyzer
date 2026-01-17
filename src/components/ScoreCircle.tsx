import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const sizeConfig = {
  sm: { width: 44, strokeWidth: 3.5, fontSize: 'text-xs', fontWeight: 'font-bold' },
  md: { width: 90, strokeWidth: 5, fontSize: 'text-2xl', fontWeight: 'font-bold' },
  lg: { width: 130, strokeWidth: 6, fontSize: 'text-4xl', fontWeight: 'font-bold' }
};

export function ScoreCircle({ score, size = 'md', className, animated = true }: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const colorClass = useMemo(() => {
    if (score >= 70) return 'stroke-success';
    if (score >= 50) return 'stroke-warning';
    return 'stroke-danger';
  }, [score]);

  const textColorClass = useMemo(() => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  }, [score]);

  const glowClass = useMemo(() => {
    if (score >= 70) return 'score-glow-success';
    if (score >= 50) return 'score-glow-warning';
    return 'score-glow-danger';
  }, [score]);

  return (
    <div 
      className={cn('relative flex items-center justify-center', glowClass, className)} 
      style={{ width: config.width, height: config.width }}
    >
      <svg
        width={config.width}
        height={config.width}
        viewBox={`0 0 ${config.width} ${config.width}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={cn(colorClass, 'transition-all duration-1000 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? offset : offset,
          }}
        />
      </svg>
      <div className={cn(
        'absolute inset-0 flex items-center justify-center',
        config.fontSize,
        config.fontWeight,
        textColorClass
      )}>
        {score}
      </div>
    </div>
  );
}
