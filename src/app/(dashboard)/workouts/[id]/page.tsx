'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workout-store';
import { starterTemplates } from '@/data/workout-templates';
import { WorkoutDetail } from '@/components/workouts/workout-detail';

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const saved = useWorkoutStore((s) => s.savedWorkouts.find((w) => w.id === id));
  const template = starterTemplates.find((t) => t.id === id);
  const userTemplate = useWorkoutStore((s) => s.templates.find((t) => t.id === id));

  const workout = saved || template || userTemplate;

  if (!workout) {
    notFound();
  }

  return <WorkoutDetail workout={workout} />;
}
