'use client';

import { motion } from 'framer-motion';

export function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-border/50 bg-card rounded-2xl border p-6 ${className}`}
    >
      <h3 className="text-foreground mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </motion.div>
  );
}

export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="bg-muted mb-8 h-8 w-48 animate-pulse rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-muted h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-3 p-4">
      <p className="text-sm text-red-500">{message}</p>
      <button
        onClick={() => onRetry?.()}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium"
      >
        Retry
      </button>
    </div>
  );
}
