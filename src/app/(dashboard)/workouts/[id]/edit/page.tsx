'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workout-store';
import { WorkoutBuilder } from '@/components/workouts/workout-builder';

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const loadWorkout = useWorkoutStore((s) => s.loadWorkout);
  const saved = useWorkoutStore((s) => s.savedWorkouts.find((w) => w.id === id));

  useEffect(() => {
    if (saved) {
      loadWorkout(id);
    }
  }, [saved, id, loadWorkout]);

  if (!saved) {
    notFound();
  }

  return <WorkoutBuilder />;
}
