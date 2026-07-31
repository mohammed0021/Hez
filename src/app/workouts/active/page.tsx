import { ActiveWorkout } from '@/components/workouts/active-workout';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('workouts');
  return {
    title: `${t('active_workout')} - Hêz`,
  };
}

export default function ActiveWorkoutPage() {
  return <ActiveWorkout />;
}
