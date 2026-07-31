'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-foreground text-xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">{t('description')}</p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-colors"
      >
        {t('try_again')}
      </button>
    </div>
  );
}
