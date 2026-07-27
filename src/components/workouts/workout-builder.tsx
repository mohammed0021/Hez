'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Copy, Share2, Bookmark, ArrowLeft, Clock } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workout-store';
import { BlockCard } from './block-card';
import { ShareDialog } from './share-dialog';

export function WorkoutBuilder() {
  const router = useRouter();
  const workout = useWorkoutStore((s) => s.currentWorkout);
  const addBlock = useWorkoutStore((s) => s.addBlock);
  const save = useWorkoutStore((s) => s.save);
  const saveAsTemplate = useWorkoutStore((s) => s.saveAsTemplate);
  const duplicate = useWorkoutStore((s) => s.duplicate);
  const setField = useWorkoutStore((s) => s.setField);
  const createNew = useWorkoutStore((s) => s.createNew);
  const isDirty = useWorkoutStore((s) => s.isDirty);
  const [showShare, setShowShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-create a new workout if none loaded
  useEffect(() => {
    if (!workout) {
      createNew();
    }
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  if (!workout) return null;

  const handleSave = () => {
    save();
    setSaved(true);
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setSaved(false), 2000);
  };

  const totalSets = workout.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
    0,
  );

  const totalDuration = workout.blocks.reduce((s, b) => {
    const exTime = b.exercises.reduce(
      (se, e) => se + e.sets.length * (e.restSeconds + 5),
      0,
    );
    return s + exTime + b.restAfterBlock;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={workout.name}
            onChange={(e) => setField('name', e.target.value)}
            className="w-full bg-transparent text-xl font-bold text-foreground focus:outline-none placeholder:text-muted-foreground/40"
            placeholder="Workout name..."
          />
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
              <Clock size={11} /> ~{Math.round(totalDuration / 60)} min
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {workout.blocks.length} {workout.blocks.length === 1 ? 'block' : 'blocks'}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {totalSets} {totalSets === 1 ? 'set' : 'sets'}
            </span>
            {isDirty && <span className="text-[9px] text-yellow-500 font-medium">Unsaved</span>}
          </div>
        </div>
      </div>

      {/* Description */}
      <input
        type="text"
        value={workout.description}
        onChange={(e) => setField('description', e.target.value)}
        className="w-full rounded-xl border border-border/30 bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none"
        placeholder="Description (optional)"
      />

      {/* Blocks */}
      <div className="space-y-4">
        {workout.blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>

      {/* Add block */}
      <button
        onClick={() => addBlock()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 bg-card/50 py-4 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
      >
        <Plus size={18} /> Add Block
      </button>

      {/* Workout notes */}
      <div className="rounded-2xl border border-border/50 bg-card p-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Workout Notes</p>
        <textarea
          value={workout.notes}
          onChange={(e) => setField('notes', e.target.value)}
          placeholder="General notes about this workout..."
          className="w-full rounded-xl border border-border/30 bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none h-24 focus:border-primary/40 focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="rounded-2xl border border-border/50 bg-card p-4">
        <p className="mb-2 text-xs font-semibold text-foreground">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {['push', 'pull', 'legs', 'upper', 'lower', 'full body', 'strength', 'hypertrophy', 'cardio'].map(
            (tag) => {
              const active = workout.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    setField(
                      'tags',
                      active
                        ? workout.tags.filter((t) => t !== tag)
                        : [...workout.tags, tag],
                    )
                  }
                  className={`rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-xl p-3 md:left-64">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
            >
              <Share2 size={14} />
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={saveAsTemplate}
              className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
            >
              <Bookmark size={14} /> Save as Template
            </button>
            <button
              onClick={duplicate}
              className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
            >
              <Copy size={14} /> Duplicate
            </button>
          </div>
        </div>
      </div>

      <ShareDialog open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
