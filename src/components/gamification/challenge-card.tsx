'use client';

import { motion } from 'framer-motion';
import {
  Dumbbell,
  ListTodo,
  Weight,
  Pill,
  Droplets,
  Apple,
  CalendarCheck,
  Flame,
  TrendingUp,
  CalendarDays,
  Zap,
  Trophy,
  Award,
} from 'lucide-react';
import type { ChallengeDef } from '@/lib/gamification-types';
import type { ChallengeProgress } from '@/stores/gamification-store';
import { useTranslations } from 'next-intl';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Dumbbell,
  ListTodo,
  Weight,
  Pill,
  Droplets,
  Apple,
  CalendarCheck,
  Flame,
  TrendingUp,
  CalendarDays,
  Zap,
  Trophy,
  Award,
};

export function ChallengeCard({
  def,
  progress,
  index,
}: {
  def: ChallengeDef;
  progress?: ChallengeProgress;
  index: number;
}) {
  const t = useTranslations('gamification');
  const Icon = ICON_MAP[def.icon] || Dumbbell;
  const current = progress?.current || 0;
  const isCompleted = !!progress?.completedAt;
  const pct = Math.min((current / def.target) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-2xl border p-3.5 ${
        isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-card'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'
          }`}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p
              className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-foreground'}`}
            >
              {def.title}
            </p>
            {isCompleted && (
              <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[9px] font-medium text-green-600">
                Done
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 text-[10px]">{def.description}</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
              />
            </div>
            <span
              className={`text-[10px] font-medium tabular-nums ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {current}/{def.target}
            </span>
          </div>

          <p className="mt-1 text-[9px] text-amber-600/60">
            +{def.xpReward} {t('xp')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
