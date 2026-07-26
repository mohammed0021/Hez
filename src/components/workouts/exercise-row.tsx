'use client';

import { GripVertical, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { WorkoutExercise } from '@/types/workout';
import { SetRow } from './set-row';
import { useWorkoutStore } from '@/stores/workout-store';

export function ExerciseRow({
  exercise,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  exercise: WorkoutExercise;
  index: number;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const addSet = useWorkoutStore((s) => s.addSet);
  const setExerciseRest = useWorkoutStore((s) => s.setExerciseRest);
  const setExerciseNotes = useWorkoutStore((s) => s.setExerciseNotes);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/30 bg-muted/30"
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        draggable
        onDragStart={(e) => onDragStart(e, exercise.id)}
        onDragOver={(e) => onDragOver(e, exercise.id)}
        onDragEnd={onDragEnd}
      >
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground">
          <GripVertical size={14} />
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground/40 hover:text-foreground">
          <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        <span className="text-xs text-muted-foreground/60 font-mono">{index + 1}</span>
        <span className="flex-1 text-sm font-medium text-foreground truncate">{exercise.exerciseName}</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
          <span>{exercise.sets.length} sets</span>
        </div>
        <button
          onClick={() => removeExercise(exercise.id)}
          className="text-muted-foreground/30 hover:text-destructive transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="space-y-2 px-3 pb-3"
        >
          {/* Rest time selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">Rest:</span>
            {[30, 60, 90, 120, 150].map((sec) => (
              <button
                key={sec}
                onClick={() => setExerciseRest(exercise.id, sec)}
                className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  exercise.restSeconds === sec
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
          </div>

          {/* Sets */}
          <div className="space-y-1">
            {exercise.sets.map((set, i) => (
              <SetRow key={set.id} set={set} exerciseId={exercise.id} index={i} />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addSet(exercise.id)}
              className="rounded-lg bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              + Add set
            </button>
          </div>

          {/* Per-exercise notes */}
          <textarea
            value={exercise.notes}
            onChange={(e) => setExerciseNotes(exercise.id, e.target.value)}
            placeholder="Exercise notes..."
            className="w-full rounded-lg border border-border/30 bg-card p-2 text-xs text-foreground placeholder:text-muted-foreground/40 resize-none h-16 focus:border-primary/40 focus:outline-none"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
