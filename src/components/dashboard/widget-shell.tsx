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
    <div className={`bg-card border-border/50 overflow-hidden rounded-2xl border p-4 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h3 className="text-foreground text-sm font-semibold">{title}</h3>}
          {action && <div className="text-muted-foreground shrink-0 text-xs">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function WidgetSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card border-border/50 animate-pulse rounded-2xl border p-4 ${className}`}>
      <div className="bg-muted mb-3 h-3 w-24 rounded" />
      <div className="bg-muted h-8 w-16 rounded" />
      <div className="bg-muted mt-2 h-2 w-full rounded" />
    </div>
  );
}
