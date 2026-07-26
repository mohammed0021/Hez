'use client';

import { useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workout-store';
import exercises from '@/data/exercises';

export function AddExerciseSheet({ blockId, open, onClose }: { blockId: string; open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const addExercise = useWorkoutStore((s) => s.addExerciseToBlock);

  const filtered = query
    ? exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.muscleGroups.some((m) => m.toLowerCase().includes(query.toLowerCase())),
      )
    : exercises;

  const handleAdd = useCallback(
    (id: string, name: string, muscleGroups: string[]) => {
      addExercise(blockId, id, name, muscleGroups);
      onClose();
    },
    [blockId, addExercise, onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full max-w-md border-l border-border/50 bg-background"
          >
            <div className="flex h-14 items-center gap-3 border-b border-border/50 px-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="h-9 w-full rounded-xl border border-border/30 bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none"
                  autoFocus
                />
              </div>
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-3">
              <div className="space-y-1">
                {filtered.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleAdd(ex.id, ex.name, ex.muscleGroups)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted transition-colors group"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                      <Plus size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ex.name}</p>
                      <p className="text-[10px] text-muted-foreground/60 truncate">
                        {ex.muscleGroups.join(' · ')} · {ex.equipment[0]}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                      ex.difficulty === 'beginner' ? 'bg-green-500/10 text-green-500' :
                      ex.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
