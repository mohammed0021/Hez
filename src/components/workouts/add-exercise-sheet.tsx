'use client';

import { useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useWorkoutStore } from '@/stores/workout-store';
import exercises from '@/data/exercises';

export function AddExerciseSheet({
  blockId,
  open,
  onClose,
}: {
  blockId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const t = useTranslations('exercises');
  const c = useTranslations('common');
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
            className="border-border/50 bg-background fixed top-0 right-0 h-full w-full max-w-md border-l"
          >
            <div className="border-border/50 flex h-14 items-center gap-3 border-b px-4">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="text-muted-foreground/60 absolute top-1/2 left-3 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search')}
                  className="border-border/30 bg-muted text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 h-9 w-full rounded-xl border pr-3 pl-9 text-sm focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                {c('cancel')}
              </button>
            </div>

            <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-3">
              <div className="space-y-1">
                {filtered.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleAdd(ex.id, ex.name, ex.muscleGroups)}
                    className="hover:bg-muted group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
                      <Plus
                        size={14}
                        className="text-primary opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">{ex.name}</p>
                      <p className="text-muted-foreground/60 truncate text-[10px]">
                        {ex.muscleGroups.join(' · ')} · {ex.equipment[0]}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                        ex.difficulty === 'beginner'
                          ? 'bg-green-500/10 text-green-500'
                          : ex.difficulty === 'intermediate'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                      }`}
                    >
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
