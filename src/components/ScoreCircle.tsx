import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const sizeConfig = {
  sm: { width: 48, strokeWidth: 4, fontSize: 'text-sm' },
  md: { width: 80, strokeWidth: 6, fontSize: 'text-xl' },
  lg: { width: 120, strokeWidth: 8, fontSize: 'text-3xl' }
};

export function ScoreCircle({ score, size = 'md', className, animated = true }: ScoreCircleProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const color = useMemo(() => {
    if (score >= 70) return 'stroke-success';
    if (score >= 50) return 'stroke-warning';
    return 'stroke-danger';
  }, [score]);

  const bgColor = useMemo(() => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  }, [score]);

  return (
    <div className={cn('score-circle', className)} style={{ width: config.width, height: config.width }}>
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
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={cn(color, animated && 'animate-score-fill')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animated ? undefined : offset,
            ['--score-offset' as string]: offset
          }}
        />
      </svg>
      <div className={cn(
        'absolute inset-0 flex items-center justify-center font-bold',
        config.fontSize,
        bgColor
      )}>
        {score}
      </div>
    </div>
  );
}
