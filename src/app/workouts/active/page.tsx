import { ActiveWorkout } from '@/components/workouts/active-workout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Workout - Hêz',
};

export default function ActiveWorkoutPage() {
  return <ActiveWorkout />;
}
