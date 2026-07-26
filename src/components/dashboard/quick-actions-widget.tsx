'use client';

import { motion } from 'framer-motion';
import { Play, Plus, Target, Apple, Camera, Scale } from 'lucide-react';

const actions = [
  { id: 'workout', icon: Play, label: 'Start Workout', color: 'bg-primary text-primary-foreground', href: '/workouts' },
  { id: 'meal', icon: Plus, label: 'Log Meal', color: 'bg-blue-500/10 text-blue-500', href: '/nutrition' },
  { id: 'weight', icon: Scale, label: 'Log Weight', color: 'bg-green-500/10 text-green-500', href: '/progress' },
  { id: 'photo', icon: Camera, label: 'Progress Pic', color: 'bg-purple-500/10 text-purple-500', href: '/progress' },
  { id: 'water', icon: Apple, label: 'Log Water', color: 'bg-cyan-500/10 text-cyan-500', href: '/nutrition' },
  { id: 'goal', icon: Target, label: 'Set Goal', color: 'bg-orange-500/10 text-orange-500', href: '/profile' },
];

export function QuickActionsWidget() {
  return (
    <div className="rounded-2xl bg-card border border-border/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-all hover:scale-105 active:scale-95 ${a.color}`}
            >
              <Icon size={18} />
              {a.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
