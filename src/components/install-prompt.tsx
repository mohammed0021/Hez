'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPrompt } from '@/lib/pwa';
import { Button } from '@/components/ui/button';
import { Download, Share2, X } from 'lucide-react';
import { useState } from 'react';

export function InstallPrompt() {
  const { isInstallable, isInstalled, install, showIOSInstructions } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <AnimatePresence>
      {isInstallable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm safe-bottom"
        >
          <div className="relative rounded-2xl border border-border/50 bg-popover p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                <Download size={20} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Install Hêz</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Add to your home screen for the best experience
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => setDismissed(true)}>
                Not Now
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
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm safe-bottom"
        >
          <div className="relative rounded-2xl border border-border/50 bg-popover p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                <Share2 size={20} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Install on iOS</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tap the share button <Share2 size={12} className="inline" /> and select &ldquo;Add to Home Screen&rdquo;
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => setDismissed(true)}>
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
