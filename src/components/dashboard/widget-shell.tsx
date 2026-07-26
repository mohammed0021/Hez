'use client';

export function DashboardWidget({
  children,
  className = '',
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-card border border-border/50 p-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
          {action && <div className="text-xs text-muted-foreground">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function WidgetSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-card border border-border/50 p-4 animate-pulse ${className}`}>
      <div className="mb-3 h-3 w-24 rounded bg-muted" />
      <div className="h-8 w-16 rounded bg-muted" />
      <div className="mt-2 h-2 w-full rounded bg-muted" />
    </div>
  );
}
