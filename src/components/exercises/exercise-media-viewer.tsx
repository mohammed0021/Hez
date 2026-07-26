'use client';

import { X, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';

export function ExerciseMediaViewer() {
  const isOpen = useExerciseStore((s) => s.mediaViewerOpen);
  const mediaIndex = useExerciseStore((s) => s.mediaViewerIndex);
  const close = useExerciseStore((s) => s.closeMediaViewer);
  const selectedId = useExerciseStore((s) => s.selectedExerciseId);

  const exercise = exercises.find((e) => e.id === selectedId);
  if (!exercise || !isOpen) return null;

  const mediaItems: { type: 'video' | 'image'; url: string; label: string }[] = [];
  if (exercise.videoUrl) mediaItems.push({ type: 'video', url: exercise.videoUrl, label: 'Demonstration Video' });
  if (exercise.imageUrl) mediaItems.push({ type: 'image', url: exercise.imageUrl, label: exercise.name });

  if (mediaItems.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8"
            >
              <ImageIcon size={48} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No media available for this exercise</p>
              <button onClick={close} className="rounded-xl bg-muted px-4 py-2 text-sm text-foreground">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const current = mediaItems[mediaIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-card"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div className="flex items-center gap-2">
                {current.type === 'video' ? <Play size={14} className="text-primary" /> : <ImageIcon size={14} className="text-muted-foreground" />}
                <span className="text-sm font-medium text-foreground">{current.label}</span>
              </div>
              <button onClick={close} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="relative flex aspect-video items-center justify-center bg-muted">
              {current.type === 'video' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/20">
                    <Play size={32} className="ml-1 text-primary" />
                  </div>
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink size={14} /> Watch on YouTube
                  </a>
                </div>
              ) : (
                <ImageIcon size={48} className="text-muted-foreground/30" />
              )}
            </div>

            {mediaItems.length > 1 && (
              <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
                <button
                  onClick={() => useExerciseStore.getState().openMediaViewer(mediaIndex - 1)}
                  disabled={mediaIndex === 0}
                  className="flex items-center gap-1 text-xs text-muted-foreground disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-muted-foreground">
                  {mediaIndex + 1} / {mediaItems.length}
                </span>
                <button
                  onClick={() => useExerciseStore.getState().openMediaViewer(mediaIndex + 1)}
                  disabled={mediaIndex === mediaItems.length - 1}
                  className="flex items-center gap-1 text-xs text-muted-foreground disabled:opacity-30"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
