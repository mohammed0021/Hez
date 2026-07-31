'use client';

import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { useExerciseStore } from '@/stores/exercise-store';

export function ExerciseSearch() {
  const t = useTranslations('exercises');
  const query = useExerciseStore((s) => s.searchQuery);
  const setQuery = useExerciseStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search
        size={16}
        className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search')}
        className="border-border/50 bg-card text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 h-11 w-full rounded-2xl border pr-10 pl-10 text-sm focus:outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="text-muted-foreground/60 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
