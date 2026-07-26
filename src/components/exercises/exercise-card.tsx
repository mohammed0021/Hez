'use client';

import { memo } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import type { Exercise } from '@/types/exercise';
import { useExerciseStore } from '@/stores/exercise-store';
import { Badge } from '@/components/ui/badge';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

export const ExerciseCard = memo(function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const isFavorite = useExerciseStore((s) => s.isFavorite(exercise.id));
  const toggleFavorite = useExerciseStore((s) => s.toggleFavorite);

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="group border-border/50 bg-card hover:border-primary/30 relative block rounded-2xl border p-4 transition-all hover:shadow-md"
    >
      <div className="bg-muted mb-3 flex aspect-[4/3] items-center justify-center rounded-xl">
        <span className="text-muted-foreground/40 text-2xl">
          {exercise.muscleGroups[0] === 'Core'
            ? '🔄'
            : exercise.muscleGroups[0] === 'Legs'
              ? '🦵'
              : exercise.muscleGroups[0] === 'Arms'
                ? '💪'
                : exercise.muscleGroups[0] === 'Chest'
                  ? '🏋️'
                  : exercise.muscleGroups[0] === 'Back'
                    ? '🔙'
                    : exercise.muscleGroups[0] === 'Shoulders'
                      ? '⬆️'
                      : '🏋️'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-foreground line-clamp-1 text-sm font-semibold">{exercise.name}</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(exercise.id);
            }}
            className="shrink-0"
          >
            <Heart
              size={16}
              className={
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors'
              }
            />
          </button>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-xs">{exercise.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {exercise.muscleGroups.slice(0, 3).map((mg) => (
            <Badge key={mg} variant="secondary" className="px-1.5 py-0 text-[9px]">
              {mg}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground/60 text-[10px]">{exercise.equipment[0]}</span>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${difficultyColors[exercise.difficulty]}`}
          >
            {exercise.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
});
