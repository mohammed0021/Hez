'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, X } from 'lucide-react';
import { Confetti } from './confetti';
import { useTranslations } from 'next-intl';

export function LevelUpModal({
  level,
  open,
  onClose,
}: {
  level: number;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('gamification');
  return (
    <AnimatePresence>
      {open && (
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
              className="relative mx-4 w-full max-w-xs rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/20 to-orange-500/10 p-8 text-center"
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
                className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30"
              >
                <ArrowUp size={28} className="text-white" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-xs font-medium tracking-wider text-amber-600 uppercase"
              >
                {t('level_up')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-foreground mt-1 text-4xl font-bold"
              >
                {level}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mt-4 flex items-center justify-center gap-1.5 text-xs"
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>{t('level_up_message', { level })}</span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={onClose}
                className="bg-primary text-primary-foreground mt-5 w-full rounded-xl py-2.5 text-xs font-medium transition-transform active:scale-[0.98]"
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
