'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import { ExerciseDetail } from '@/components/exercises/exercise-detail';
import { ExerciseMediaViewer } from '@/components/exercises/exercise-media-viewer';
import exercises from '@/data/exercises';

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const exercise = exercises.find((e) => e.id === id);

  if (!exercise) notFound();

  return (
    <>
      <ExerciseDetail exercise={exercise} />
      <ExerciseMediaViewer />
    </>
  );
}
