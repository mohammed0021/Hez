'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPrompt } from '@/lib/pwa';
import { Button } from '@/components/ui/button';
import { Download, Share2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function InstallPrompt() {
  const { isInstallable, isInstalled, install, showIOSInstructions } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations('common');

  if (isInstalled || dismissed) return null;

  return (
    <AnimatePresence>
      {isInstallable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="safe-bottom fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm"
        >
          <div className="border-border/50 bg-popover relative rounded-2xl border p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2 flex size-6 min-h-[44px] min-w-[44px] items-center justify-center rounded-full"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Download size={20} className="text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">Install Hêz</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Add to your home screen for the best experience
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={() => setDismissed(true)}
              >
                {t('not_now')}
              </Button>
              <Button size="sm" className="flex-1" onClick={install}>
                <Download size={14} />
                Install
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {showIOSInstructions && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="safe-bottom fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm"
        >
          <div className="border-border/50 bg-popover relative rounded-2xl border p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2 flex size-6 min-h-[44px] min-w-[44px] items-center justify-center rounded-full"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Share2 size={20} className="text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">Install on iOS</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Tap the share button <Share2 size={12} className="inline" /> and select &ldquo;Add
                  to Home Screen&rdquo;
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={() => setDismissed(true)}
              >
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
