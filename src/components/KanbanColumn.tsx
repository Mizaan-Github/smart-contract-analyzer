import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  title: string;
  count: number;
  color: 'todo' | 'progress' | 'done';
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  todo: 'bg-kanban-todo/10 text-kanban-todo',
  progress: 'bg-kanban-progress/10 text-kanban-progress',
  done: 'bg-kanban-done/10 text-kanban-done'
};

const dotClasses = {
  todo: 'bg-kanban-todo',
  progress: 'bg-kanban-progress',
  done: 'bg-kanban-done'
};

export function KanbanColumn({ title, count, color, children, className }: KanbanColumnProps) {
  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      {/* Header */}
      <div className={cn('kanban-column-header mb-4', colorClasses[color])}>
        <span className={cn('w-2 h-2 rounded-full', dotClasses[color])} />
        <span className="font-semibold">{title}</span>
        <span className="ml-auto text-xs bg-current/10 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-3 overflow-auto">
        {children}
      </div>
    </div>
  );
}
