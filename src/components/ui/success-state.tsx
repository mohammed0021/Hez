import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({ title, description, action, className }: SuccessStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <div className="bg-success/10 mb-4 flex size-16 items-center justify-center rounded-2xl">
        <CheckCircle size={28} className="text-success" />
      </div>
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1 max-w-xs text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
