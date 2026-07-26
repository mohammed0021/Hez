'use client';

import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamification-store';
import { Sparkles } from 'lucide-react';

export function XpBar({
  showLabel = true,
  size = 'md',
}: {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const getLevel = useGamificationStore((s) => s.getLevel);
  const { level, currentXp, nextXp, progress } = getLevel();

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
  const textSizes = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-xs' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={size === 'sm' ? 10 : 12} className="text-amber-500" />
            <span className={`text-foreground font-bold ${textSizes[size]}`}>Level {level}</span>
          </div>
          <span className={`text-muted-foreground ${textSizes[size]}`}>
            {currentXp.toLocaleString()} / {nextXp.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className={`bg-muted w-full overflow-hidden rounded-full ${heights[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress * 100, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 ${heights[size]}`}
        />
      </div>
    </div>
  );
}
