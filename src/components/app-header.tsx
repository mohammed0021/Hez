'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { APP_NAME } from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function AppHeader({ title, showBack, onBack, rightAction }: AppHeaderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isHeaderVisible = useUiStore((s) => s.isHeaderVisible);
  const t = useTranslations('common');

  if (isDesktop) return null;

  return (
    <AnimatePresence>
      {isHeaderVisible && (
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          className="fixed top-0 right-0 left-0 z-50"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="border-border/50 bg-background/95 mx-auto max-w-lg border-b backdrop-blur-xl">
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {!showBack && (
                  <button
                    onClick={() => useUiStore.getState().setSidebarOpen(true)}
                    className="-ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center"
                    aria-label={t('open')}
                  >
                    <Menu size={22} className="text-foreground" />
                  </button>
                )}
                {showBack && (
                  <button
                    onClick={onBack}
                    className="-ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center"
                    aria-label={t('back')}
                  >
                    <ChevronLeft size={24} className="text-foreground" />
                  </button>
                )}
                <h1 className="text-foreground truncate text-lg font-semibold">
                  {title || APP_NAME}
                </h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">{rightAction}</div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
