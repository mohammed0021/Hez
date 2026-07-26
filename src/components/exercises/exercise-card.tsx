'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Heart } from 'lucide-react';
import Link from 'next/link';
import type { Exercise } from '@/types/exercise';
import { useExerciseStore } from '@/stores/exercise-store';
import { Badge } from '@/components/ui/badge';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

export function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const toggleFavorite = useExerciseStore((s) => s.toggleFavorite);
  const isFavorite = useExerciseStore((s) => s.isFavorite(exercise.id));
  const fav = isFavorite;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        href={`/exercises/${exercise.id}`}
        className="group relative block rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
      >
        <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-xl bg-muted">
          <Dumbbell size={32} className="text-muted-foreground/40" />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{exercise.name}</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(exercise.id);
              }}
              className="shrink-0"
            >
              <Heart
                size={16}
                className={fav ? 'fill-red-500 text-red-500' : 'text-muted-foreground/40 transition-colors group-hover:text-muted-foreground/70'}
              />
            </button>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">{exercise.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {exercise.muscleGroups.slice(0, 3).map((mg) => (
              <Badge key={mg} variant="secondary" className="text-[9px] px-1.5 py-0">
                {mg}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/60">{exercise.equipment[0]}</span>
            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
