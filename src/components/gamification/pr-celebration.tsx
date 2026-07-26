'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Confetti } from './confetti';

export function PRCelebration({
  exerciseName,
  open,
  onClose,
}: {
  exerciseName: string | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && exerciseName && (
        <>
          <Confetti active={open} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 w-full max-w-xs rounded-3xl border border-green-500/30 bg-gradient-to-b from-green-500/20 to-emerald-500/10 p-8 text-center"
            >
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
              >
                <X size={16} />
              </button>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
              >
                <Trophy size={28} className="text-white" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-xs font-medium tracking-wider text-green-600 uppercase"
              >
                New Personal Record!
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-foreground mt-1 text-lg font-bold"
              >
                {exerciseName}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mt-2 text-xs"
              >
                You just beat your previous best! Keep crushing it!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="bg-primary text-primary-foreground mt-5 w-full rounded-xl py-2.5 text-xs font-medium transition-transform active:scale-[0.98]"
              >
                Let&apos;s Go!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
