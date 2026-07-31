'use client';

import { useRouter } from 'next/navigation';
import { Dumbbell, Plus, Clock, Bookmark, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { starterTemplates } from '@/data/workout-templates';

export default function WorkoutsPage() {
  const router = useRouter();
  const t = useTranslations('workouts');
  const c = useTranslations('common');
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const userTemplates = useWorkoutStore((s) => s.templates);
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);
  const allTemplates = [...starterTemplates, ...userTemplates];

  const allWorkouts = [...savedWorkouts].reverse();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {t('saved_workouts_count', { count: allWorkouts.length })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/workouts/templates"
            className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Bookmark size={14} /> {t('templates')}
          </Link>
          <Link
            href="/workouts/new"
            className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Plus size={14} /> {c('new')}
          </Link>
        </div>
      </div>

      {/* Quick start from template */}
      {allTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className="from-primary/10 to-primary/5 border-primary/20 mt-5 rounded-2xl border bg-gradient-to-br p-4"
        >
          <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
            {t('quick_start')}
          </p>
          <div className="flex scrollbar-none gap-2 overflow-x-auto pb-1">
            {allTemplates.slice(0, 5).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  startWorkout(tmpl);
                  router.push('/workouts/active');
                }}
                className="bg-card/80 border-border/50 hover:bg-card min-h-[44px] shrink-0 rounded-xl border px-4 py-3 text-left transition-colors"
              >
                <p className="text-foreground text-sm font-semibold whitespace-nowrap">
                  {tmpl.name}
                </p>
                <p className="text-muted-foreground/60 mt-0.5 text-[10px]">
                  {t('duration_min', { minutes: tmpl.estimatedDuration })}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Saved workouts */}
      <h2 className="text-foreground mt-7 mb-3 text-sm font-semibold">{t('saved_workouts')}</h2>
      <div className="space-y-2">
        {allWorkouts.length === 0 ? (
          <div className="border-border/50 bg-card flex flex-col items-center gap-3 rounded-2xl border p-4">
            <Dumbbell size={36} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">{t('no_saved_workouts')}</p>
            <Link
              href="/workouts/new"
              className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
            >
              <Plus size={14} /> {t('create_first_workout')}
            </Link>
          </div>
        ) : (
          allWorkouts.map((w, i) => {
            const totalSets = w.blocks.reduce(
              (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
              0,
            );
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/workouts/${w.id}`}
                  className="bg-card border-border/50 flex items-center gap-4 rounded-2xl border p-4"
                >
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                    <Dumbbell size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-semibold">{w.name}</p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {t('duration_min', { minutes: w.estimatedDuration })}
                      </span>
                      <span>{t('blocks_count', { count: w.blocks.length })}</span>
                      <span>{t('sets_count', { count: totalSets })}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      startWorkout(w);
                      router.push('/workouts/active');
                    }}
                    className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium"
                  >
                    <Zap size={12} /> {c('start')}
                  </button>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}
