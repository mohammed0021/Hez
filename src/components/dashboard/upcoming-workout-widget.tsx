'use client';

import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useWorkoutStore } from '@/stores/workout-store';

export function UpcomingWorkoutWidget() {
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const nextWorkout = savedWorkouts.length > 1 ? savedWorkouts[1] : (savedWorkouts[0] ?? null);

  if (!nextWorkout) {
    return (
      <DashboardWidget className="from-primary/5 border-dashed bg-gradient-to-br to-transparent">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
            <Calendar size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-foreground text-sm font-semibold">Next Workout</p>
            <p className="text-muted-foreground mt-1 text-xs">Create a workout to see it here</p>
          </div>
        </div>
      </DashboardWidget>
    );
  }

  const exerciseList = nextWorkout.blocks
    .flatMap((b) => b.exercises)
    .slice(0, 4)
    .map((e) => e.exerciseName);

  const remaining = nextWorkout.blocks.flatMap((b) => b.exercises).length - exerciseList.length;

  return (
    <DashboardWidget className="from-primary/5 border-dashed bg-gradient-to-br to-transparent">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
          <Calendar size={18} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">Next: {nextWorkout.name}</p>
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={11} /> ~{nextWorkout.estimatedDuration} min
            </span>
          </div>
          {exerciseList.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {exerciseList.map((ex) => (
                <span
                  key={ex}
                  className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[9px]"
                >
                  {ex}
                </span>
              ))}
              {remaining > 0 && (
                <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[9px]">
                  +{remaining} more
                </span>
              )}
            </div>
          )}
        </div>
        <button className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
          <Dumbbell size={16} />
        </button>
      </div>
    </DashboardWidget>
  );
}
