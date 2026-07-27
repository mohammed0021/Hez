'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workout-store';
import { WorkoutBuilder } from '@/components/workouts/workout-builder';

export default function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hydrated, setHydrated] = useState(false);
  const loadWorkout = useWorkoutStore((s) => s.loadWorkout);
  const saved = useWorkoutStore((s) => s.savedWorkouts.find((w) => w.id === id));

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (saved) {
      loadWorkout(id);
    }
  }, [saved, id, loadWorkout]);

  if (hydrated && !saved) {
    notFound();
  }

  return <WorkoutBuilder />;
}
