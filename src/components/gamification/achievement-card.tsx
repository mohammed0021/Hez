'use client';

import { motion } from 'framer-motion';
import {
  Dumbbell,
  Flame,
  Swords,
  Trophy,
  Weight,
  Award,
  CalendarCheck,
  Calendar,
  Sunrise,
  Moon,
  Zap,
  Crown,
  Ruler,
  Apple,
  Pill,
  TrendingUp,
  Compass,
  Clock,
  ArrowUp,
  ArrowUpCircle,
  Gem,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { AchievementDef } from '@/lib/gamification-types';
import type { UnlockedAchievement } from '@/stores/gamification-store';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Dumbbell,
  Flame,
  Swords,
  Trophy,
  Weight,
  Award,
  CalendarCheck,
  Calendar,
  Sunrise,
  Moon,
  Zap,
  Crown,
  Ruler,
  Apple,
  Pill,
  TrendingUp,
  Compass,
  Clock,
  ArrowUp,
  ArrowUpCircle,
  Gem,
  Sparkles,
};

export function AchievementCard({
  def,
  unlocked,
  index,
}: {
  def: AchievementDef;
  unlocked?: UnlockedAchievement;
  index: number;
}) {
  const Icon = ICON_MAP[def.icon] || Sparkles;
  const isUnlocked = !!unlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`relative rounded-2xl border p-3.5 ${
        isUnlocked
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5'
          : 'border-border/50 bg-card opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            isUnlocked ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'
          }`}
        >
          {isUnlocked ? <Icon size={18} /> : <Lock size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p
              className={`text-sm font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {def.title}
            </p>
            {isUnlocked && <Sparkles size={10} className="shrink-0 text-amber-500" />}
          </div>
          <p className="text-muted-foreground mt-0.5 text-[10px]">{def.description}</p>
          {isUnlocked && unlocked?.unlockedAt && (
            <p className="mt-1 text-[9px] text-amber-600/60">
              Unlocked {new Date(unlocked.unlockedAt).toLocaleDateString()}
            </p>
          )}
          {!isUnlocked && (
            <p className="text-muted-foreground/50 mt-1 text-[9px]">+{def.xpReward} XP</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
