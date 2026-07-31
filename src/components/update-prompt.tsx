'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useServiceWorker } from '@/lib/pwa';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UpdatePrompt() {
  const { updateAvailable, update } = useServiceWorker();
  const t = useTranslations('common');

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="safe-bottom fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm"
        >
          <div className="border-border/50 bg-popover rounded-2xl border p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <RefreshCw size={20} className="text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">Update Available</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  A new version of Hêz is ready
                </p>
              </div>
              <Button size="sm" onClick={update}>
                {t('update')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
