'use client';

import { Plus, X, Layers, Columns3, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import type { WorkoutBlock, BlockType } from '@/types/workout';
import { ExerciseRow } from './exercise-row';
import { AddExerciseSheet } from './add-exercise-sheet';
import { useWorkoutStore } from '@/stores/workout-store';

const blockIcons: Record<BlockType, typeof Layers> = {
  standard: Layers,
  superset: Columns3,
  giant_set: LayoutGrid,
};

const blockLabels: Record<BlockType, string> = {
  standard: 'Standard',
  superset: 'Superset',
  giant_set: 'Giant Set',
};

export function BlockCard({
  block,
}: {
  block: WorkoutBlock;
}) {
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

  const handleExDragStart = useCallback((e: React.DragEvent, id: string) => {
    dragIndex.current = block.exercises.findIndex((ex) => ex.id === id);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  }, [block.exercises]);

  const handleExDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleExDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
  }, []);

  const handleExDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const toIndex = block.exercises.findIndex((ex) => ex.id === targetId);
    if (dragIndex.current !== toIndex) {
      moveExercise(block.id, dragIndex.current, toIndex);
    }
    (e.currentTarget as HTMLElement).style.opacity = '1';
  }, [block.id, block.exercises, moveExercise]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/50 bg-card"
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <Icon size={16} className="text-primary" />
        <button
          onClick={cycleType}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          {blockLabels[block.type]}
        </button>
        <span className="text-[10px] text-muted-foreground/60">
          {block.exercises.length} {block.exercises.length === 1 ? 'exercise' : 'exercises'}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus size={12} /> Add Exercise
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
      <div
        className="p-3 space-y-2"
        onDragOver={(e) => e.preventDefault()}
      >
        {block.exercises.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground/40">
            <p className="text-xs">No exercises yet</p>
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-lg bg-muted px-3 py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              + Add your first exercise
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
      <div className="flex items-center gap-2 border-t border-border/30 px-4 py-2">
        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">Rest after block:</span>
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
