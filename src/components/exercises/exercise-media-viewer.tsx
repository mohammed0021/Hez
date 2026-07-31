'use client';

import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExerciseStore } from '@/stores/exercise-store';
import exercises from '@/data/exercises';

export function ExerciseMediaViewer() {
  const t = useTranslations('exercises');
  const tCommon = useTranslations('common');
  const isOpen = useExerciseStore((s) => s.mediaViewerOpen);
  const mediaIndex = useExerciseStore((s) => s.mediaViewerIndex);
  const close = useExerciseStore((s) => s.closeMediaViewer);
  const selectedId = useExerciseStore((s) => s.selectedExerciseId);

  const exercise = exercises.find((e) => e.id === selectedId);
  if (!exercise || !isOpen) return null;

  const mediaItems: { type: 'video' | 'image'; url: string; label: string }[] = [];
  if (exercise.videoUrl)
    mediaItems.push({ type: 'video', url: exercise.videoUrl, label: t('demonstration_video') });
  if (exercise.imageUrl)
    mediaItems.push({ type: 'image', url: exercise.imageUrl, label: exercise.name });

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
              className="bg-card flex flex-col items-center gap-4 rounded-2xl p-8"
            >
              <ImageIcon size={48} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">{t('no_media')}</p>
              <button
                onClick={close}
                className="bg-muted text-foreground rounded-xl px-4 py-2 text-sm"
              >
                {tCommon('close')}
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
            className="bg-card w-full max-w-lg overflow-hidden rounded-2xl"
          >
            <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                {current.type === 'video' ? (
                  <Play size={14} className="text-primary" />
                ) : (
                  <ImageIcon size={14} className="text-muted-foreground" />
                )}
                <span className="text-foreground text-sm font-medium">{current.label}</span>
              </div>
              <button onClick={close} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="bg-muted relative flex aspect-video items-center justify-center">
              {current.type === 'video' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-primary/20 flex size-16 items-center justify-center rounded-full">
                    <Play size={32} className="text-primary ml-1" />
                  </div>
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1.5 text-sm hover:underline"
                  >
                    <ExternalLink size={14} /> {t('watch_youtube')}
                  </a>
                </div>
              ) : (
                <ImageIcon size={48} className="text-muted-foreground/30" />
              )}
            </div>

            {mediaItems.length > 1 && (
              <div className="border-border/50 flex items-center justify-between border-t px-4 py-3">
                <button
                  onClick={() => useExerciseStore.getState().openMediaViewer(mediaIndex - 1)}
                  disabled={mediaIndex === 0}
                  className="text-muted-foreground flex items-center gap-1 text-xs disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> {t('previous')}
                </button>
                <span className="text-muted-foreground text-xs">
                  {mediaIndex + 1} / {mediaItems.length}
                </span>
                <button
                  onClick={() => useExerciseStore.getState().openMediaViewer(mediaIndex + 1)}
                  disabled={mediaIndex === mediaItems.length - 1}
                  className="text-muted-foreground flex items-center gap-1 text-xs disabled:opacity-30"
                >
                  {tCommon('next')} <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
