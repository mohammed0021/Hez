'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Dumbbell,
  HelpCircle,
  Lightbulb,
  Repeat2,
  Play,
  ImageOff,
  BarChart3,
  Heart,
  Plus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { Exercise } from '@/types/exercise';
import { FavoritesButton } from './favorites-button';
import { MuscleAnatomy } from './muscle-anatomy';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';
import { Badge } from '@/components/ui/badge';

const difficultyConfig: { [key: string]: { color: string } } = {
  beginner: { color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  intermediate: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  advanced: { color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  Barbell: 'barbell',
  Dumbbell: 'dumbbell',
  Machine: 'machine',
  Cable: 'cable',
  Kettlebell: 'kettlebell',
  'Resistance Band': 'band',
  Bodyweight: 'bodyweight',
};

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const t = useTranslations('exercises');
  const isFavorite = useExerciseStore((s) => s.isFavorite(exercise.id));
  const toggleFavorite = useExerciseStore((s) => s.toggleFavorite);
  const [imgError, setImgError] = useState(false);

  const alternatives = exercise.alternativeIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean) as Exercise[];

  const difficulty = difficultyConfig[exercise.difficulty]!;

  return (
    <div className="space-y-6 pb-8">
      <Link
        href="/exercises"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> {t('back_to_library')}
      </Link>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-primary/10 to-primary/5 relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br"
      >
        {exercise.imageUrl && !imgError ? (
          <img
            src={exercise.imageUrl}
            alt={t('image_alt', { name: exercise.name })}
            className="size-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3">
            <ImageOff size={48} className="text-muted-foreground/20" />
            <span className="text-muted-foreground/40 text-lg font-medium">{exercise.name}</span>
          </div>
        )}
      </motion.div>

      {/* Title & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${difficulty.color}`}
            >
              {t(DIFFICULTY_LABELS[exercise.difficulty] ?? 'beginner')}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {exercise.category}
            </Badge>
            <span className="text-muted-foreground/60 text-[10px]">{exercise.exerciseType}</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold">{exercise.name}</h1>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            {exercise.description}
          </p>
        </div>
        <FavoritesButton exerciseId={exercise.id} />
      </motion.div>

      {/* Quick action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-2"
      >
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
          <Play size={16} /> {t('start_exercise')}
        </button>
        <button className="border-border text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors">
          <Plus size={16} /> {t('add_to_workout')}
        </button>
        <button
          onClick={() => toggleFavorite(exercise.id)}
          className={`border-border inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            isFavorite
              ? 'border-red-500/30 bg-red-500/5 text-red-500'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Heart size={16} className={isFavorite ? 'fill-red-500' : ''} />
          {isFavorite ? t('favorited') : t('favorite')}
        </button>
      </motion.div>

      {/* Equipment & Muscles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <div className="border-border/50 bg-card rounded-2xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Dumbbell size={16} className="text-primary" />
            <h2 className="text-foreground text-sm font-semibold">{t('equipment')}</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {exercise.equipment.map((eq) => (
              <Badge key={eq} variant="outline" className="text-xs">
                {t(EQUIPMENT_LABELS[eq] ?? 'other')}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-border/50 bg-card rounded-2xl border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <h2 className="text-foreground text-sm font-semibold">{t('target_muscles')}</h2>
          </div>
          <div className="space-y-1.5">
            <div>
              <p className="text-muted-foreground/60 mb-1 text-[10px] font-medium tracking-wider uppercase">
                {t('primary')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.primaryMuscleGroups.map((mg) => (
                  <Badge key={mg} variant="default" className="text-xs">
                    {mg}
                  </Badge>
                ))}
              </div>
            </div>
            {exercise.secondaryMuscleGroups.length > 0 && (
              <div>
                <p className="text-muted-foreground/60 mb-1 text-[10px] font-medium tracking-wider uppercase">
                  {t('secondary')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.secondaryMuscleGroups.map((mg) => (
                    <Badge key={mg} variant="secondary" className="text-xs">
                      {mg}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="border-border/50 bg-card rounded-2xl border p-4"
        >
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell size={16} className="text-primary" />
            <h2 className="text-foreground text-sm font-semibold">{t('instructions')}</h2>
          </div>
          <ol className="space-y-3">
            {exercise.instructions.map((instruction, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {i + 1}
                </span>
                <span className="text-foreground pt-0.5 leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Tips & Mistakes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {exercise.commonMistakes.length > 0 && (
            <div className="border-border/50 bg-card rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle size={16} className="text-red-500" />
                <h2 className="text-foreground text-sm font-semibold">{t('common_mistakes')}</h2>
              </div>
              <ul className="space-y-2">
                {exercise.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-foreground flex gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-500" />
                    <span className="leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.trainingTips.length > 0 && (
            <div className="border-border/50 bg-card rounded-2xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" />
                <h2 className="text-foreground text-sm font-semibold">{t('pro_tips')}</h2>
              </div>
              <ul className="space-y-2">
                {exercise.trainingTips.map((tip, i) => (
                  <li key={i} className="text-foreground flex gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-yellow-500" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* Muscle Anatomy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="border-border/50 bg-card rounded-2xl border p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" />
          <h2 className="text-foreground text-sm font-semibold">{t('muscle_anatomy')}</h2>
        </div>
        <MuscleAnatomy activeMuscles={exercise.muscleGroups} compact />
      </motion.div>

      {/* Alternative Exercises */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-border/50 bg-card rounded-2xl border p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Repeat2 size={16} className="text-primary" />
            <h2 className="text-foreground text-sm font-semibold">{t('alternatives')}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map((alt) => {
              const altDifficulty = difficultyConfig[alt.difficulty]!;
              return (
                <Link
                  key={alt.id}
                  href={`/exercises/${alt.id}`}
                  className="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-xl p-3 transition-colors"
                >
                  <div className="from-primary/10 to-primary/5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                    <Dumbbell size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">{alt.name}</p>
                    <p className="text-muted-foreground/60 text-[10px]">
                      {alt.primaryMuscleGroups.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${altDifficulty.color}`}
                  >
                    {t(DIFFICULTY_LABELS[alt.difficulty] ?? 'beginner')}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
