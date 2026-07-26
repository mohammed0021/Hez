'use client';

import { Clock, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';

const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

export function RecentlyUsed() {
  const recentlyUsed = useExerciseStore((s) => s.recentlyUsed);

  if (recentlyUsed.length === 0) return null;

  const recents = recentlyUsed
    .map((id) => exerciseMap.get(id))
    .filter(Boolean)
    .slice(0, 5);

  if (recents.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={14} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Recently Used</h3>
      </div>
      <div className="space-y-2">
        {recents.map((ex) => (
          <Link
            key={ex!.id}
            href={`/exercises/${ex!.id}`}
            className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2 transition-colors hover:bg-muted"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Dumbbell size={14} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{ex!.name}</p>
              <p className="text-[10px] text-muted-foreground/60">{ex!.muscleGroups.slice(0, 2).join(', ')}</p>
            </div>
            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
              ex!.difficulty === 'beginner' ? 'bg-green-500/10 text-green-500' :
              ex!.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {ex!.difficulty}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
