'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useExerciseStore } from '@/stores/exercise-store';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/types/exercise';
import type { Difficulty } from '@/types/exercise';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function ExerciseFilters() {
  const [open, setOpen] = useState(false);
  const filters = useExerciseStore((s) => s.activeFilters);
  const setMuscleFilter = useExerciseStore((s) => s.setMuscleGroupFilter);
  const setEquipmentFilter = useExerciseStore((s) => s.setEquipmentFilter);
  const setDifficultyFilter = useExerciseStore((s) => s.setDifficultyFilter);
  const clearFilters = useExerciseStore((s) => s.clearFilters);

  const hasFilters = filters.muscleGroups.length > 0 || filters.equipment.length > 0 || filters.difficulties.length > 0;

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const activeCount = filters.muscleGroups.length + filters.equipment.length + filters.difficulties.length;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-5 rounded-2xl border border-border/50 bg-card p-4">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}

              <Section title="Muscle Group" count={filters.muscleGroups.length}>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_GROUPS.map((mg) => (
                    <Chip
                      key={mg}
                      label={mg}
                      active={filters.muscleGroups.includes(mg)}
                      onClick={() => toggleArray(filters.muscleGroups, mg, setMuscleFilter)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Equipment" count={filters.equipment.length}>
                <div className="flex flex-wrap gap-1.5">
                  {EQUIPMENT_LIST.map((eq) => (
                    <Chip
                      key={eq}
                      label={eq}
                      active={filters.equipment.includes(eq)}
                      onClick={() => toggleArray(filters.equipment, eq, setEquipmentFilter)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Difficulty" count={filters.difficulties.length}>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <Chip
                      key={d}
                      label={d.charAt(0).toUpperCase() + d.slice(1)}
                      active={filters.difficulties.includes(d)}
                      onClick={() =>
                        setDifficultyFilter(
                          filters.difficulties.includes(d)
                            ? filters.difficulties.filter((x) => x !== d)
                            : [...filters.difficulties, d],
                        )
                      }
                    />
                  ))}
                </div>
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{title}</span>
        {count > 0 && <span className="text-[10px] text-primary">{count} selected</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {label}
    </button>
  );
}
