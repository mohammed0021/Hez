'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { APP_NAME } from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function AppHeader({ title, showBack, onBack, rightAction }: AppHeaderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isHeaderVisible = useUiStore((s) => s.isHeaderVisible);

  if (isDesktop) return null;

  return (
    <AnimatePresence>
      {isHeaderVisible && (
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          className="fixed left-0 right-0 top-0 z-50 safe-top"
        >
          <div className="mx-auto max-w-lg border-b border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {showBack && (
                  <button onClick={onBack} className="flex items-center justify-center -ml-1">
                    <ChevronLeft size={24} className="text-foreground" />
                  </button>
                )}
                <h1 className="text-lg font-semibold text-foreground">
                  {title || APP_NAME}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {rightAction || (
                  <button className="flex items-center justify-center">
                    <MoreVertical size={22} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
