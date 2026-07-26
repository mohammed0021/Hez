'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, HelpCircle, Lightbulb, Repeat2, Play, ImageIcon, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import type { Exercise } from '@/types/exercise';
import { FavoritesButton } from './favorites-button';
import { MuscleAnatomy } from './muscle-anatomy';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';
import { Badge } from '@/components/ui/badge';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
};

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const addRecentlyUsed = useExerciseStore((s) => s.addRecentlyUsed);
  const openMediaViewer = useExerciseStore((s) => s.openMediaViewer);
  const selectExercise = useExerciseStore((s) => s.selectExercise);

  const alternatives = exercise.alternativeIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean) as Exercise[];

  const handleViewMedia = () => {
    selectExercise(exercise.id);
    openMediaViewer(0);
    addRecentlyUsed(exercise.id);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/exercises"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} /> Back to library
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{exercise.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{exercise.description}</p>
          </div>
          <FavoritesButton exerciseId={exercise.id} />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
          <Badge variant="secondary" className="text-xs">{exercise.category}</Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {exercise.muscleGroups.map((mg) => (
            <Badge key={mg} variant="outline" className="text-xs">{mg}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {exercise.equipment.map((eq) => (
            <Badge key={eq} variant="secondary" className="text-xs">{eq}</Badge>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Play size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Media</h2>
            </div>
            <button
              onClick={handleViewMedia}
              className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted transition-colors hover:bg-muted/80"
            >
              {exercise.videoUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/20">
                    <Play size={28} className="ml-1 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">Watch demonstration</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={32} className="text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground">No media available</span>
                </div>
              )}
            </button>
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
              >
                Open in YouTube
              </a>
            )}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Muscle Anatomy</h2>
            </div>
            <MuscleAnatomy activeMuscles={exercise.muscleGroups} compact />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Dumbbell size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Instructions</h2>
            </div>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {exercise.commonMistakes.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle size={16} className="text-red-500" />
                <h2 className="text-sm font-semibold text-foreground">Common Mistakes</h2>
              </div>
              <ul className="space-y-2">
                {exercise.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-red-500" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.trainingTips.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" />
                <h2 className="text-sm font-semibold text-foreground">Training Tips</h2>
              </div>
              <ul className="space-y-2">
                {exercise.trainingTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yellow-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Repeat2 size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Alternative Exercises</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                href={`/exercises/${alt.id}`}
                className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Dumbbell size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{alt.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{alt.muscleGroups.slice(0, 2).join(', ')}</p>
                </div>
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                  difficultyColors[alt.difficulty]
                }`}>
                  {alt.difficulty}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
