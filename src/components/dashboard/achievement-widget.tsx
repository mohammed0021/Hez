'use client';

import { motion } from 'framer-motion';
import { Award, Star, Zap, Flame } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

const achievements = [
  { id: '1', icon: Star, label: 'Week Warrior', desc: '7-day streak', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: '2', icon: Zap, label: 'Volume Master', desc: '10,000 kg total', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: '3', icon: Flame, label: 'Getting Started', desc: '5 workouts done', color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export function AchievementWidget() {
  return (
    <DashboardWidget title="Achievements">
      <div className="space-y-2.5">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5"
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${a.bg} ${a.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
              <Award size={16} className={a.color} />
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
        <span className="text-xs text-muted-foreground">Total XP</span>
        <span className="text-sm font-bold text-foreground">1,250</span>
      </div>
    </DashboardWidget>
  );
}
