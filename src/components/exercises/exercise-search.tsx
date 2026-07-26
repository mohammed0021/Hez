'use client';

import { Search, X } from 'lucide-react';
import { useExerciseStore } from '@/stores/exercise-store';

export function ExerciseSearch() {
  const query = useExerciseStore((s) => s.searchQuery);
  const setQuery = useExerciseStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search exercises..."
        className="h-11 w-full rounded-2xl border border-border/50 bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
