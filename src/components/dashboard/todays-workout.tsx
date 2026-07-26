'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

export function TodaysWorkout() {
  return (
    <DashboardWidget className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Today&apos;s Workout</p>
          <p className="text-lg font-bold text-foreground">Upper Body Push</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>6 exercises</span>
            <span>•</span>
            <span>~45 min</span>
          </div>
        </div>
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Play size={20} className="ml-0.5" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {['Bench Press', 'Incline DB', 'Lat Pulldown', 'Lateral Raise', 'Triceps', 'Curls'].map((ex, i) => (
          <motion.div
            key={ex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="rounded-lg bg-background/60 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm"
          >
            {ex}
          </motion.div>
        ))}
      </div>
    </DashboardWidget>
  );
}
