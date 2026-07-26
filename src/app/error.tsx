'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-foreground text-xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
