'use client';

import { useTranslations } from 'next-intl';
import { Clock, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';

const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

export function RecentlyUsed() {
  const t = useTranslations('exercises');
  const recentlyUsed = useExerciseStore((s) => s.recentlyUsed);

  if (recentlyUsed.length === 0) return null;

  const recents = recentlyUsed
    .map((id) => exerciseMap.get(id))
    .filter(Boolean)
    .slice(0, 5);

  if (recents.length === 0) return null;

  return (
    <div className="border-border/50 bg-card rounded-2xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={14} className="text-muted-foreground" />
        <h3 className="text-foreground text-sm font-semibold">{t('recently_used')}</h3>
      </div>
      <div className="space-y-2">
        {recents.map((ex) => (
          <Link
            key={ex!.id}
            href={`/exercises/${ex!.id}`}
            className="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2 transition-colors"
          >
            <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
              <Dumbbell size={14} className="text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{ex!.name}</p>
              <p className="text-muted-foreground/60 text-[10px]">
                {ex!.muscleGroups.slice(0, 2).join(', ')}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                ex!.difficulty === 'beginner'
                  ? 'bg-green-500/10 text-green-500'
                  : ex!.difficulty === 'intermediate'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
              }`}
            >
              {t(DIFFICULTY_LABELS[ex!.difficulty] ?? 'beginner')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
