'use client';

import type { ReactNode } from 'react';

export function DashboardWidget({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-border/50 bg-card rounded-2xl border p-4 ${className ?? ''}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {title}
          </p>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
