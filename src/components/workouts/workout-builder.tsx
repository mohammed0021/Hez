'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Copy, Share2, Bookmark, ArrowLeft, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWorkoutStore } from '@/stores/workout-store';
import { BlockCard } from './block-card';
import { ShareDialog } from './share-dialog';

export function WorkoutBuilder() {
  const router = useRouter();
  const t = useTranslations('workouts');
  const c = useTranslations('common');
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
    const exTime = b.exercises.reduce((se, e) => se + e.sets.length * (e.restSeconds + 5), 0);
    return s + exTime + b.restAfterBlock;
  }, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={workout.name}
            onChange={(e) => setField('name', e.target.value)}
            className="text-foreground placeholder:text-muted-foreground/40 w-full bg-transparent text-xl font-bold focus:outline-none"
            placeholder={t('workout_name_input_placeholder')}
          />
          <div className="mt-0.5 flex items-center gap-3">
            <span className="text-muted-foreground/60 flex items-center gap-1 text-[10px]">
              <Clock size={11} /> {t('duration_min', { minutes: Math.round(totalDuration / 60) })}
            </span>
            <span className="text-muted-foreground/60 text-[10px]">
              {t('blocks_count', { count: workout.blocks.length })}
            </span>
            <span className="text-muted-foreground/60 text-[10px]">
              {t('sets_count', { count: totalSets })}
            </span>
            {isDirty && (
              <span className="text-[9px] font-medium text-yellow-500">{t('unsaved')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <input
        type="text"
        value={workout.description}
        onChange={(e) => setField('description', e.target.value)}
        className="border-border/30 bg-card text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
        placeholder={t('description_optional')}
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
        className="border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-primary flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 text-sm transition-colors"
      >
        <Plus size={18} /> {t('add_block')}
      </button>

      {/* Workout notes */}
      <div className="border-border/50 bg-card rounded-2xl border p-4">
        <p className="text-foreground mb-2 text-sm font-semibold">{t('workout_notes')}</p>
        <textarea
          value={workout.notes}
          onChange={(e) => setField('notes', e.target.value)}
          placeholder={t('notes_placeholder')}
          className="border-border/30 bg-muted text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 h-24 w-full resize-none rounded-xl border p-3 text-sm focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="border-border/50 bg-card rounded-2xl border p-4">
        <p className="text-foreground mb-2 text-sm font-semibold">{t('tags')}</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            'push',
            'pull',
            'legs',
            'upper',
            'lower',
            'full body',
            'strength',
            'hypertrophy',
            'cardio',
          ].map((tag) => {
            const active = workout.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() =>
                  setField(
                    'tags',
                    active ? workout.tags.filter((t) => t !== tag) : [...workout.tags, tag],
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
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-border/50 bg-background/80 fixed right-0 bottom-0 left-0 border-t p-4 backdrop-blur-xl md:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
            >
              <Save size={14} />
              {saved ? c('saved') : c('save')}
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
            >
              <Share2 size={14} />
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={saveAsTemplate}
              className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
            >
              <Bookmark size={14} /> {t('save_as_template')}
            </button>
            <button
              onClick={duplicate}
              className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
            >
              <Copy size={14} /> {t('duplicate')}
            </button>
          </div>
        </div>
      </div>

      <ShareDialog open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
