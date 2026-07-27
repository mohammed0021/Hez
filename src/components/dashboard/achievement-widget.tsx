'use client';

import { motion } from 'framer-motion';
import {
  Award, Dumbbell, Zap, Flame, Star, Target, Heart, Clock, Trophy,
  Swords, Weight, CalendarCheck, Calendar, Sunrise, Moon, Crown,
  Ruler, Apple, Pill, TrendingUp, Compass, ArrowUp, ArrowUpCircle,
  Gem, ListTodo, Droplets, CalendarDays,
} from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useGamificationStore } from '@/stores/gamification-store';
import { ACHIEVEMENTS } from '@/lib/gamification-types';

const iconMap: Record<string, typeof Dumbbell> = {
  Dumbbell, Zap, Flame, Star, Target, Heart, Clock, Award, Trophy,
  Swords, Weight, CalendarCheck, Calendar, Sunrise, Moon, Crown,
  Ruler, Apple, Pill, TrendingUp, Compass, ArrowUp, ArrowUpCircle,
  Gem, ListTodo, Droplets, CalendarDays,
};

export function AchievementWidget() {
  const achievements = useGamificationStore((s) => s.achievements);
  const xp = useGamificationStore((s) => s.xp);
  const getLevel = useGamificationStore((s) => s.getLevel);

  const recentAchievements = achievements.slice(-3).reverse();
  const level = getLevel();

  return (
    <DashboardWidget title="Achievements">
      {recentAchievements.length > 0 ? (
        <div className="space-y-2.5">
          {recentAchievements.map((a, i) => {
            const def = ACHIEVEMENTS.find((d) => d.id === a.id);
            const IconComp = def ? iconMap[def.icon] || Award : Award;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="bg-muted/50 flex items-center gap-3 rounded-xl p-2.5"
              >
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                  <IconComp size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">{def?.title || a.id}</p>
                  <p className="text-muted-foreground text-xs">{def?.description || ''}</p>
                </div>
                <Award size={16} className="text-primary" />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground flex flex-col items-center py-4">
          <Award size={24} className="mb-2 opacity-40" />
          <p className="text-xs">No achievements yet</p>
          <p className="text-muted-foreground/60 text-[10px]">
            Complete workouts to earn achievements
          </p>
        </div>
      )}
      <div className="bg-muted/30 mt-3 flex items-center justify-between rounded-xl px-3 py-2">
        <span className="text-muted-foreground text-xs">Level {level.level}</span>
        <span className="text-foreground text-sm font-bold">{xp.toLocaleString()} XP</span>
      </div>
    </DashboardWidget>
  );
}
