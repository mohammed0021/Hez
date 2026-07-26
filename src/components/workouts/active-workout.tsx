'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, X, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useActiveWorkoutStore, getCurrentExercise, getCurrentSet, calculateVolume } from '@/stores/active-workout-store';
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

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <Dumbbell size={48} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No active workout</p>
        <Link href="/workouts" className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
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

  const handleSetComplete = useCallback(
    (weight: number, reps: number, rpe: number | null) => {
      completeSet(weight, reps, rpe, '');
      setShowAnim(true);
      setTimeout(() => {
        setShowAnim(false);
        if (currentSet && currentSet.type !== 'warmup') {
          startRest();
        } else {
          goToNextSet();
        }
      }, 800);
    },
    [completeSet, currentSet, startRest, goToNextSet],
  );

  const handleSkipRest = useCallback(() => {
    skipRest();
    goToNextSet();
  }, [skipRest, goToNextSet]);

  const handleRestExpire = useCallback(() => {
    goToNextSet();
  }, [goToNextSet]);

  const isPreparing = data.status === 'preparing';
  const isResting = data.status === 'resting';
  const isPaused = data.status === 'paused';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Minimal header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isPreparing ? (
            <Link href="/workouts" onClick={cancelWorkout} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </Link>
          ) : (
            <button onClick={togglePause} className="text-muted-foreground hover:text-foreground">
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{data.name}</p>
            <p className="text-[10px] text-muted-foreground/60">
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
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <Pause size={48} className="text-primary mb-4" />
            <p className="text-xl font-bold text-foreground">Workout Paused</p>
            <button
              onClick={togglePause}
              className="mt-6 rounded-2xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground"
            >
              <Play size={18} className="inline mr-2" /> Resume
            </button>
            <button
              onClick={cancelWorkout}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground"
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
            className="flex flex-col items-center justify-center min-h-[50vh] gap-6"
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">First Up</p>
              <h2 className="text-2xl font-bold text-foreground">{exercise.exerciseName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{exercise.muscleGroups.join(' · ')}</p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-card border border-border/50 px-6 py-3 text-center">
                <p className="text-lg font-bold text-foreground">{exercise.sets.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sets</p>
              </div>
              <div className="rounded-2xl bg-card border border-border/50 px-6 py-3 text-center">
                <p className="text-lg font-bold text-foreground">{exercise.sets[0]?.targetReps || 0}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reps</p>
              </div>
              {exercise.sets[0] && exercise.sets[0].targetWeightKg > 0 && (
                <div className="rounded-2xl bg-card border border-border/50 px-6 py-3 text-center">
                  <p className="text-lg font-bold text-foreground">{exercise.sets[0].targetWeightKg}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Weight</p>
                </div>
              )}
            </div>

            {exercise.notes && (
              <p className="text-xs text-muted-foreground/60 italic">{exercise.notes}</p>
            )}

            <button
              onClick={startSession}
              className="rounded-2xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 active:scale-95 transition-transform"
            >
              Start Workout
            </button>
          </motion.div>
        )}

        {!isPreparing && exercise && currentSet && !isResting && !isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Exercise header */}
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                {block?.type === 'superset' ? 'Superset' : block?.type === 'giant_set' ? 'Giant Set' : 'Exercise'}
                {' '}{data.currentExerciseIndex + 1} of {block?.exercises.length || 0}
              </p>
              <h2 className="text-xl font-bold text-foreground">{exercise.exerciseName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{exercise.muscleGroups.join(' · ')}</p>
            </div>

            {/* Completion animation */}
            <div className="h-24 flex items-center justify-center">
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
            <div className="flex justify-center gap-4 text-[10px] text-muted-foreground/60">
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
