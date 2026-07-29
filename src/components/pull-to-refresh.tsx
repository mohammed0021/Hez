'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function PullToRefresh({ children, onRefresh, threshold = 60 }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const pullProgress = useTransform(y, [0, threshold], [0, 1]);

  const handlePanEnd = useCallback(async () => {
    if (y.get() >= threshold && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch {
        // Refresh failed silently - caller handles its own errors
      } finally {
        setRefreshing(false);
      }
    }
    y.set(0);
  }, [onRefresh, refreshing, y, threshold]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <motion.div
        style={{ y: springY }}
        onPan={(_, info) => {
          if (info.offset.y > 0 && !refreshing) {
            y.set(info.offset.y);
          }
        }}
        onPanEnd={handlePanEnd}
        className="relative"
      >
        <motion.div
          className="absolute right-0 left-0 flex items-center justify-center"
          style={{
            top: useTransform(y, (v) => Math.min(v - 40, 0)),
            opacity: pullProgress,
          }}
        >
          <motion.div
            animate={refreshing ? { rotate: 360 } : {}}
            transition={{ repeat: refreshing ? Infinity : 0, duration: 1, ease: 'linear' }}
          >
            <RefreshCw
              size={24}
              className="text-primary"
              style={{
                transform: `rotate(${pullProgress.get() * 180}deg)`,
              }}
            />
          </motion.div>
        </motion.div>
        {children}
      </motion.div>
    </div>
  );
}
