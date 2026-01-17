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
  todo: { dot: 'bg-kanban-todo', text: 'text-kanban-todo', bg: 'bg-kanban-todo/8' },
  progress: { dot: 'bg-kanban-progress', text: 'text-kanban-progress', bg: 'bg-kanban-progress/8' },
  done: { dot: 'bg-kanban-done', text: 'text-kanban-done', bg: 'bg-kanban-done/8' }
};

export function KanbanColumn({ title, count, color, children, className }: KanbanColumnProps) {
  const config = colorConfig[color];
  
  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      <div className="col-header">
        <span className={cn('w-2 h-2 rounded-full', config.dot)} />
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', config.bg, config.text)}>
          {count}
        </span>
      </div>
      
      <div className="flex-1 space-y-2.5 overflow-auto scroll-minimal pr-1 stagger">
        {children}
      </div>
    </div>
  );
}
