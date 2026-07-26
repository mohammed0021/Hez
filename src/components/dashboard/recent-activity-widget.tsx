'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Trophy, Target, Zap } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

const activities = [
  { id: '1', icon: Dumbbell, label: 'Completed Upper Body', detail: '45 min • 6 exercises', time: '2h ago', color: 'text-primary' },
  { id: '2', icon: Target, label: 'New PR: Bench Press', detail: '85 kg • +2.5 kg', time: '1d ago', color: 'text-green-500' },
  { id: '3', icon: Trophy, label: '5-day streak achieved', detail: 'Keep it going!', time: '2d ago', color: 'text-orange-500' },
  { id: '4', icon: Zap, label: 'Logged nutrition', detail: 'Breakfast: 420 kcal', time: '2d ago', color: 'text-blue-500' },
];

export function RecentActivityWidget() {
  return (
    <DashboardWidget title="Recent Activity">
      <div className="space-y-3">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3"
            >
              <div className={`flex size-8 items-center justify-center rounded-lg bg-muted ${a.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground/60">{a.time}</span>
            </motion.div>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
