'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Clock, BarChart3, Target, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { calculateVolume, calculateEstimated1RM } from '@/stores/active-workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export function WorkoutSummary() {
  const data = useActiveWorkoutStore((s) => s.data);
  const cancelWorkout = useActiveWorkoutStore((s) => s.cancelWorkout);

  if (!data || data.status !== 'completed') return null;

  const volume = calculateVolume(data);
  const totalSets = data.blocks.reduce((s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0), 0);
  const completedSets = data.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.filter((st) => st.completed).length, 0),
    0,
  );
  const startTime = data.startedAt ? new Date(data.startedAt) : null;
  const endTime = data.completedAt ? new Date(data.completedAt) : null;
  const durationMs = startTime && endTime ? endTime.getTime() - startTime.getTime() - data.totalPausedMs : 0;
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
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Trophy size={32} className="text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Workout Complete!</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Clock} label="Duration" value={`${durationMin} min`} />
        <StatCard icon={BarChart3} label="Volume" value={`${volume.toLocaleString()} kg`} />
        <StatCard icon={Target} label="Sets" value={`${completedSets}/${totalSets}`} />
        <StatCard icon={Zap} label="Est. 1RM" value={estimated1RM > 0 ? `${estimated1RM} kg` : '--'} />
      </div>

      <div className="space-y-2">
        {data.blocks.map((block, bi) => (
          <div key={block.id} className="rounded-2xl border border-border/50 bg-card p-3">
            <p className="text-xs font-semibold text-foreground mb-2">
              {block.type === 'superset' ? 'Superset' : block.type === 'giant_set' ? 'Giant Set' : 'Block'} {bi + 1}
            </p>
            {block.exercises.map((ex) => {
              const completed = ex.sets.filter((s) => s.completed).length;
              return (
                <div key={ex.id} className="flex items-center gap-3 py-1.5">
                  <Dumbbell size={12} className="text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">{ex.exerciseName}</span>
                  <span className="text-xs text-muted-foreground">{completed}/{ex.sets.length} sets</span>
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
          className="flex-1 rounded-xl bg-muted py-3 text-center text-sm font-medium text-foreground"
        >
          Done
        </Link>
        <Link
          href="/workouts/new"
          onClick={cancelWorkout}
          className="flex-1 rounded-xl bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
        >
          New Workout
        </Link>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 text-center">
      <Icon size={20} className="mx-auto text-primary" />
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
