'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, X, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import {
  useActiveWorkoutStore,
  getCurrentExercise,
  getCurrentSet,
  calculateVolume,
} from '@/stores/active-workout-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { SetLogger } from './set-logger';
import { RestTimer } from './rest-timer';
import { CompletionAnimation } from './completion-animation';
import { WorkoutSummary } from './workout-summary';

export function ActiveWorkout() {
  const data = useActiveWorkoutStore((s) => s.data);
  const startSession = useActiveWorkoutStore((s) => s.startSession);
  const completeSet = useActiveWorkoutStore((s) => s.completeSet);
  const skipSet = useActiveWorkoutStore((s) => s.skipSet);
  const goToNextSet = useActiveWorkoutStore((s) => s.goToNextSet);
  const togglePause = useActiveWorkoutStore((s) => s.togglePause);
  const cancelWorkout = useActiveWorkoutStore((s) => s.cancelWorkout);
  const startRest = useActiveWorkoutStore((s) => s.startRest);
  const skipRest = useActiveWorkoutStore((s) => s.skipRest);

  const addSession = useWorkoutHistoryStore((s) => s.addSession);
  const savedRef = useRef(false);

  useEffect(() => {
    if (data?.status === 'completed' && !savedRef.current) {
      savedRef.current = true;
      addSession(data);
    }
  }, [data?.status, data, addSession]);

  const [showAnim, setShowAnim] = useState(false);

  const handleSetComplete = useCallback(
    (weight: number, reps: number, rpe: number | null) => {
      if (!data) return;
      const current = getCurrentSet(data);
      completeSet(weight, reps, rpe, '');
      setShowAnim(true);
      setTimeout(() => {
        setShowAnim(false);
        if (current && current.type !== 'warmup') {
          startRest();
        } else {
          goToNextSet();
        }
      }, 800);
    },
    [data, completeSet, startRest, goToNextSet],
  );

  const handleSkipRest = useCallback(() => {
    skipRest();
    goToNextSet();
  }, [skipRest, goToNextSet]);

  const handleRestExpire = useCallback(() => {
    goToNextSet();
  }, [goToNextSet]);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Dumbbell size={48} className="text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">No active workout</p>
        <Link
          href="/workouts"
          className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs font-medium"
        >
          Browse Workouts
        </Link>
      </div>
    );
  }

  if (data.status === 'completed') {
    return <WorkoutSummary />;
  }

  const exercise = getCurrentExercise(data);
  const currentSet = getCurrentSet(data);
  const block = data.blocks[data.currentBlockIndex];
  const completedBlocks = data.blocks.filter((b) => b.completed).length;

  const isPreparing = data.status === 'preparing';
  const isResting = data.status === 'resting';
  const isPaused = data.status === 'paused';

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col">
      {/* Minimal header */}
      <div className="border-border/30 flex items-center justify-between border-b px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isPreparing ? (
            <Link
              href="/workouts"
              onClick={cancelWorkout}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </Link>
          ) : (
            <button onClick={togglePause} className="text-muted-foreground hover:text-foreground">
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-xs font-semibold">{data.name}</p>
            <p className="text-muted-foreground/60 text-[10px]">
              {completedBlocks}/{data.blocks.length} blocks
            </p>
          </div>
        </div>
      </div>

      {/* Paused overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/90 absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <Pause size={48} className="text-primary mb-4" />
            <p className="text-foreground text-xl font-bold">Workout Paused</p>
            <button
              onClick={togglePause}
              className="bg-primary text-primary-foreground mt-6 rounded-2xl px-8 py-3 text-sm font-medium"
            >
              <Play size={18} className="mr-2 inline" /> Resume
            </button>
            <button
              onClick={cancelWorkout}
              className="text-muted-foreground hover:text-foreground mt-3 text-xs"
            >
              End Workout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isPreparing && exercise && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[50vh] flex-col items-center justify-center gap-6"
          >
            <div className="text-center">
              <p className="text-muted-foreground mb-2 text-xs tracking-widest uppercase">
                First Up
              </p>
              <h2 className="text-foreground text-2xl font-bold">{exercise.exerciseName}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {exercise.muscleGroups.join(' · ')}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-card border-border/50 rounded-2xl border px-6 py-3 text-center">
                <p className="text-foreground text-lg font-bold">{exercise.sets.length}</p>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">Sets</p>
              </div>
              <div className="bg-card border-border/50 rounded-2xl border px-6 py-3 text-center">
                <p className="text-foreground text-lg font-bold">
                  {exercise.sets[0]?.targetReps || 0}
                </p>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">Reps</p>
              </div>
              {exercise.sets[0] && exercise.sets[0].targetWeightKg > 0 && (
                <div className="bg-card border-border/50 rounded-2xl border px-6 py-3 text-center">
                  <p className="text-foreground text-lg font-bold">
                    {exercise.sets[0].targetWeightKg}
                  </p>
                  <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                    Weight
                  </p>
                </div>
              )}
            </div>

            {exercise.notes && (
              <p className="text-muted-foreground/60 text-xs italic">{exercise.notes}</p>
            )}

            <button
              onClick={startSession}
              className="bg-primary text-primary-foreground shadow-primary/30 rounded-2xl px-10 py-4 text-base font-bold shadow-xl transition-transform active:scale-95"
            >
              Start Workout
            </button>
          </motion.div>
        )}

        {!isPreparing && exercise && currentSet && !isResting && !isPaused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Exercise header */}
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-[10px] tracking-widest uppercase">
                {block?.type === 'superset'
                  ? 'Superset'
                  : block?.type === 'giant_set'
                    ? 'Giant Set'
                    : 'Exercise'}{' '}
                {data.currentExerciseIndex + 1} of {block?.exercises.length || 0}
              </p>
              <h2 className="text-foreground text-xl font-bold">{exercise.exerciseName}</h2>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {exercise.muscleGroups.join(' · ')}
              </p>
            </div>

            {/* Completion animation */}
            <div className="flex h-24 items-center justify-center">
              <CompletionAnimation show={showAnim} />
            </div>

            {/* Progress dots for sets */}
            <div className="flex justify-center gap-1.5">
              {exercise.sets.map((s, i) => (
                <div
                  key={s.id}
                  className={`size-2.5 rounded-full transition-colors ${
                    s.completed
                      ? 'bg-primary'
                      : i === data.currentSetIndex
                        ? 'bg-primary/50'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Set logger */}
            {!showAnim && (
              <SetLogger
                defaultWeight={currentSet.targetWeightKg}
                defaultReps={currentSet.targetReps}
                defaultRpe={currentSet.rpe}
                setNumber={data.currentSetIndex + 1}
                totalSets={exercise.sets.length}
                onComplete={handleSetComplete}
                onSkip={() => {
                  skipSet();
                  setShowAnim(true);
                  setTimeout(() => {
                    setShowAnim(false);
                    goToNextSet();
                  }, 500);
                }}
              />
            )}

            {/* Live stats */}
            <div className="text-muted-foreground/60 flex justify-center gap-4 text-[10px]">
              <span>Volume: {calculateVolume(data).toLocaleString()} kg</span>
            </div>
          </motion.div>
        )}

        {isResting && (
          <RestTimer
            endTime={data.restTimerEnd}
            onExpire={handleRestExpire}
            onSkip={handleSkipRest}
          />
        )}
      </div>
    </div>
  );
}
