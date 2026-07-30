'use client';

import { memo, useState } from 'react';
import { Heart, ImageOff } from 'lucide-react';
import Link from 'next/link';
import type { Exercise } from '@/types/exercise';
import { useExerciseStore } from '@/stores/exercise-store';
import { Badge } from '@/components/ui/badge';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

const MUSCLE_GRADIENT: Record<string, string> = {
  Chest: 'from-red-500/20 to-red-600/10',
  Shoulders: 'from-orange-500/20 to-orange-600/10',
  Back: 'from-blue-500/20 to-blue-600/10',
  Biceps: 'from-purple-500/20 to-purple-600/10',
  Triceps: 'from-pink-500/20 to-pink-600/10',
  Forearms: 'from-amber-500/20 to-amber-600/10',
  Quadriceps: 'from-green-500/20 to-green-600/10',
  Hamstrings: 'from-teal-500/20 to-teal-600/10',
  Glutes: 'from-cyan-500/20 to-cyan-600/10',
  Calves: 'from-sky-500/20 to-sky-600/10',
  Core: 'from-yellow-500/20 to-yellow-600/10',
  Obliques: 'from-lime-500/20 to-lime-600/10',
  'Lower Back': 'from-indigo-500/20 to-indigo-600/10',
  Traps: 'from-violet-500/20 to-violet-600/10',
  'Full Body': 'from-gray-500/20 to-gray-600/10',
};

export const ExerciseCard = memo(function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const isFavorite = useExerciseStore((s) => s.isFavorite(exercise.id));
  const toggleFavorite = useExerciseStore((s) => s.toggleFavorite);
  const [imgError, setImgError] = useState(false);

  const primaryMuscle = exercise.primaryMuscleGroups[0] ?? exercise.muscleGroups[0] ?? 'Chest';
  const gradient = MUSCLE_GRADIENT[primaryMuscle] ?? 'from-gray-500/20 to-gray-600/10';

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="group border-border/50 bg-card hover:border-primary/30 relative block rounded-2xl border p-3 transition-all hover:shadow-md"
    >
      <div
        className={`relative mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}
      >
        {exercise.imageUrl && !imgError ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImageOff size={24} className="text-muted-foreground/30" />
            <span className="text-muted-foreground/40 line-clamp-2 px-2 text-center text-[10px] font-medium">
              {exercise.name}
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(exercise.id);
          }}
          className="bg-background/60 absolute top-2 right-2 flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full backdrop-blur-sm"
        >
          <Heart
            size={14}
            className={
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-muted-foreground/60 group-hover:text-muted-foreground transition-colors'
            }
          />
        </button>
        <span
          className={`absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 text-[9px] font-medium backdrop-blur-sm ${difficultyColors[exercise.difficulty]}`}
        >
          {exercise.difficulty}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-foreground line-clamp-1 text-sm font-semibold">{exercise.name}</h3>

        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {exercise.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {exercise.primaryMuscleGroups.slice(0, 2).map((mg) => (
            <Badge key={mg} variant="secondary" className="px-1.5 py-0 text-[9px]">
              {mg}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-muted-foreground/60 text-[10px]">
            {exercise.equipment[0] ?? 'Bodyweight'}
          </span>
          <span className="text-muted-foreground/40 text-[9px]">{exercise.exerciseType}</span>
        </div>
      </div>
    </Link>
  );
});
