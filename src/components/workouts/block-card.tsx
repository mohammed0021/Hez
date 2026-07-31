'use client';

import { Plus, X, Layers, Columns3, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { WorkoutBlock, BlockType } from '@/types/workout';
import { ExerciseRow } from './exercise-row';
import { AddExerciseSheet } from './add-exercise-sheet';
import { useWorkoutStore } from '@/stores/workout-store';

const blockIcons: Record<BlockType, typeof Layers> = {
  standard: Layers,
  superset: Columns3,
  giant_set: LayoutGrid,
};

export function BlockCard({ block }: { block: WorkoutBlock }) {
  const t = useTranslations('workouts');
  const blockLabels: Record<BlockType, string> = {
    standard: t('block_standard'),
    superset: t('block_superset'),
    giant_set: t('block_giant_set'),
  };
  const [showAdd, setShowAdd] = useState(false);
  const dragIndex = useRef<number>(0);
  const removeBlock = useWorkoutStore((s) => s.removeBlock);
  const setBlockType = useWorkoutStore((s) => s.setBlockType);
  const setBlockRest = useWorkoutStore((s) => s.setBlockRest);
  const moveExercise = useWorkoutStore((s) => s.moveExercise);

  const Icon = blockIcons[block.type];

  const cycleType = () => {
    const types: BlockType[] = ['standard', 'superset', 'giant_set'];
    const idx = types.indexOf(block.type);
    setBlockType(block.id, types[(idx + 1) % types.length]!);
  };

  const handleExDragStart = useCallback(
    (e: React.DragEvent, id: string) => {
      dragIndex.current = block.exercises.findIndex((ex) => ex.id === id);
      e.dataTransfer.effectAllowed = 'move';
      (e.currentTarget as HTMLElement).style.opacity = '0.4';
    },
    [block.exercises],
  );

  const handleExDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleExDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
  }, []);

  const handleExDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const toIndex = block.exercises.findIndex((ex) => ex.id === targetId);
      if (dragIndex.current !== toIndex) {
        moveExercise(block.id, dragIndex.current, toIndex);
      }
      (e.currentTarget as HTMLElement).style.opacity = '1';
    },
    [block.id, block.exercises, moveExercise],
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border/50 bg-card rounded-2xl border"
    >
      {/* Block header */}
      <div className="border-border/30 flex items-center gap-2 border-b px-4 py-3">
        <Icon size={16} className="text-primary" />
        <button
          onClick={cycleType}
          className="text-foreground hover:text-primary text-sm font-semibold transition-colors"
        >
          {blockLabels[block.type]}
        </button>
        <span className="text-muted-foreground/60 text-[10px]">
          {t('exercises_count', { count: block.exercises.length })}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors"
          >
            <Plus size={12} /> {t('add_exercise')}
          </button>
          <button
            onClick={() => removeBlock(block.id)}
            className="text-muted-foreground/30 hover:text-destructive transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2 p-3" onDragOver={(e) => e.preventDefault()}>
        {block.exercises.length === 0 ? (
          <div className="text-muted-foreground/40 flex flex-col items-center gap-2 py-6">
            <p className="text-xs">{t('no_exercises_yet')}</p>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors"
            >
              + {t('add_first_exercise')}
            </button>
          </div>
        ) : (
          block.exercises.map((ex, i) => (
            <div
              key={ex.id}
              onDragOver={(e) => handleExDragOver(e)}
              onDrop={(e) => handleExDrop(e, ex.id)}
            >
              <ExerciseRow
                exercise={ex}
                index={i}
                onDragStart={handleExDragStart}
                onDragOver={handleExDragOver}
                onDragEnd={handleExDragEnd}
              />
            </div>
          ))
        )}
      </div>

      {/* Block rest */}
      <div className="border-border/30 flex items-center gap-2 border-t px-4 py-2">
        <span className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
          {t('rest_after_block')}
        </span>
        {[60, 90, 120, 150, 180].map((sec) => (
          <button
            key={sec}
            onClick={() => setBlockRest(block.id, sec)}
            className={`rounded-lg px-2 py-0.5 text-[9px] font-medium transition-colors ${
              block.restAfterBlock === sec
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
          </button>
        ))}
      </div>

      <AddExerciseSheet blockId={block.id} open={showAdd} onClose={() => setShowAdd(false)} />
    </motion.div>
  );
}
