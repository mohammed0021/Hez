'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { WorkoutSet, SetType } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workout-store';

const setTypeLabels: Record<SetType, string> = {
  normal: '',
  warmup: 'W',
  drop: 'D',
  failure: 'F',
};

const setTypeColors: Record<SetType, string> = {
  normal: '',
  warmup: 'bg-blue-500/10 text-blue-500',
  drop: 'bg-purple-500/10 text-purple-500',
  failure: 'bg-red-500/10 text-red-500',
};

export function SetRow({
  set,
  exerciseId,
  index,
}: {
  set: WorkoutSet;
  exerciseId: string;
  index: number;
}) {
  const t = useTranslations('workouts');
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const setSetType = useWorkoutStore((s) => s.setSetType);

  const cycleType = () => {
    const types: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    const idx = types.indexOf(set.type);
    setSetType(exerciseId, set.id, types[(idx + 1) % types.length]!);
  };

  return (
    <div className="bg-card flex items-center gap-1.5 rounded-lg px-2 py-1.5">
      <span className="text-muted-foreground/60 w-4 font-mono text-[10px]">{index + 1}</span>

      <button
        onClick={cycleType}
        className={`rounded-md px-1.5 py-0.5 text-[9px] leading-none font-bold ${setTypeColors[set.type]} ${
          set.type === 'normal' ? 'pointer-events-none opacity-0' : ''
        }`}
        title={t('set_type_tooltip', { type: set.type })}
      >
        {setTypeLabels[set.type]}
      </button>

      <div className="flex flex-1 items-center gap-1">
        <input
          type="number"
          value={set.weightKg || ''}
          onChange={(e) =>
            updateSet(exerciseId, set.id, { weightKg: parseFloat(e.target.value) || 0 })
          }
          className="border-border/30 text-foreground focus:border-primary/40 w-12 [appearance:textfield] rounded-md border bg-transparent px-1.5 py-0.5 text-center text-xs focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="kg"
        />
        <span className="text-muted-foreground/40 text-[10px]">×</span>
        <input
          type="number"
          value={set.reps || ''}
          onChange={(e) => updateSet(exerciseId, set.id, { reps: parseInt(e.target.value) || 0 })}
          className="border-border/30 text-foreground focus:border-primary/40 w-10 [appearance:textfield] rounded-md border bg-transparent px-1.5 py-0.5 text-center text-xs focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder={t('reps_placeholder')}
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-muted-foreground/40 text-[9px]">RPE</span>
        <input
          type="number"
          min={1}
          max={10}
          value={set.rpe ?? ''}
          onChange={(e) =>
            updateSet(exerciseId, set.id, {
              rpe: e.target.value
                ? (parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)
                : null,
            })
          }
          className="border-border/30 text-foreground focus:border-primary/40 w-7 [appearance:textfield] rounded-md border bg-transparent px-1 py-0.5 text-center text-[10px] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      <button
        onClick={() => removeSet(exerciseId, set.id)}
        className="text-muted-foreground/30 hover:text-destructive transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
