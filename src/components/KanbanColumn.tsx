import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  title: string;
  count: number;
  color: 'todo' | 'progress' | 'done';
  children: ReactNode;
  className?: string;
}

const colorConfig = {
  todo: {
    dot: 'bg-kanban-todo',
    badge: 'bg-kanban-todo/10 text-kanban-todo'
  },
  progress: {
    dot: 'bg-kanban-progress',
    badge: 'bg-kanban-progress/10 text-kanban-progress'
  },
  done: {
    dot: 'bg-kanban-done',
    badge: 'bg-kanban-done/10 text-kanban-done'
  }
};

export function KanbanColumn({ title, count, color, children, className }: KanbanColumnProps) {
  const config = colorConfig[color];
  
  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      {/* Header */}
      <div className="kanban-header mb-5">
        <span className={cn('w-2 h-2 rounded-full', config.dot)} />
        <span className="font-semibold text-sm text-foreground">{title}</span>
        <span className={cn(
          'ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-md',
          config.badge
        )}>
          {count}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-3 overflow-auto scrollbar-thin pr-1 stagger-children">
        {children}
      </div>
    </div>
  );
}
