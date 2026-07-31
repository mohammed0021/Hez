'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export function CompletionAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center justify-center"
        >
          <div className="bg-primary shadow-primary/40 flex size-20 items-center justify-center rounded-full shadow-2xl">
            <Check size={40} className="text-primary-foreground" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
