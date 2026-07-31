import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-2xl">
        {icon || <Inbox size={28} className="text-muted-foreground" />}
      </div>
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1 max-w-xs text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
