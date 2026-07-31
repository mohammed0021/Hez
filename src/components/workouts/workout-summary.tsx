'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Clock, BarChart3, Target, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { calculateVolume, calculateEstimated1RM } from '@/stores/active-workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export function WorkoutSummary() {
  const t = useTranslations('workouts');
  const c = useTranslations('common');
  const data = useActiveWorkoutStore((s) => s.data);
  const cancelWorkout = useActiveWorkoutStore((s) => s.cancelWorkout);

  if (!data || data.status !== 'completed') return null;

  const volume = calculateVolume(data);
  const totalSets = data.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
    0,
  );
  const completedSets = data.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.filter((st) => st.completed).length, 0),
    0,
  );
  const startTime = data.startedAt ? new Date(data.startedAt) : null;
  const endTime = data.completedAt ? new Date(data.completedAt) : null;
  const durationMs =
    startTime && endTime ? endTime.getTime() - startTime.getTime() - data.totalPausedMs : 0;
  const durationMin = Math.round(durationMs / 60000);

  // Find heaviest lift for 1RM
  let maxWeight = 0;
  let maxReps = 0;
  for (const b of data.blocks) {
    for (const e of b.exercises) {
      for (const s of e.sets) {
        if (s.completed && s.actualWeightKg > maxWeight) {
          maxWeight = s.actualWeightKg;
          maxReps = s.actualReps;
        }
      }
    }
  }
  const estimated1RM = calculateEstimated1RM(maxWeight, maxReps);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md space-y-6 px-4 py-8"
    >
      <div className="text-center">
        <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
          <Trophy size={32} className="text-primary" />
        </div>
        <h1 className="text-foreground mt-4 text-2xl font-bold">{t('workout_complete')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{data.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Clock} label={t('duration')} value={`${durationMin} min`} />
        <StatCard icon={BarChart3} label={t('volume')} value={`${volume.toLocaleString()} kg`} />
        <StatCard icon={Target} label={t('sets')} value={`${completedSets}/${totalSets}`} />
        <StatCard
          icon={Zap}
          label={t('est_1rm')}
          value={estimated1RM > 0 ? `${estimated1RM} kg` : '--'}
        />
      </div>

      <div className="space-y-2">
        {data.blocks.map((block, bi) => (
          <div key={block.id} className="border-border/50 bg-card rounded-2xl border p-3">
            <p className="text-foreground mb-2 text-xs font-semibold">
              {block.type === 'superset'
                ? t('block_superset')
                : block.type === 'giant_set'
                  ? t('block_giant_set')
                  : t('block')}{' '}
              {bi + 1}
            </p>
            {block.exercises.map((ex) => {
              const completed = ex.sets.filter((s) => s.completed).length;
              return (
                <div key={ex.id} className="flex items-center gap-3 py-1.5">
                  <Dumbbell size={12} className="text-muted-foreground" />
                  <span className="text-foreground flex-1 text-sm">{ex.exerciseName}</span>
                  <span className="text-muted-foreground text-xs">
                    {t('sets_progress', { completed, total: ex.sets.length })}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/workouts"
          onClick={cancelWorkout}
          className="bg-muted text-foreground flex-1 rounded-xl py-3 text-center text-sm font-medium"
        >
          {c('done')}
        </Link>
        <Link
          href="/workouts/new"
          onClick={cancelWorkout}
          className="bg-primary text-primary-foreground flex-1 rounded-xl py-3 text-center text-sm font-medium"
        >
          {t('new_workout')}
        </Link>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border/50 bg-card rounded-2xl border p-4 text-center">
      <Icon size={20} className="text-primary mx-auto" />
      <p className="text-foreground mt-1 text-lg font-bold">{value}</p>
      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">{label}</p>
    </div>
  );
}
