'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useServiceWorker } from '@/lib/pwa';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdatePrompt() {
  const { updateAvailable, update } = useServiceWorker();

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm safe-bottom"
        >
          <div className="rounded-2xl border border-border/50 bg-popover p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                <RefreshCw size={20} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Update Available</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  A new version of Hêz is ready
                </p>
              </div>
              <Button size="sm" onClick={update}>
                Update
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
