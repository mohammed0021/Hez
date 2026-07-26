'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardWidget } from './widget-shell';

const records = [
  { exercise: 'Bench Press', value: '85 kg', date: '2 weeks ago', type: 'max_weight' },
  { exercise: 'Deadlift', value: '140 kg', date: '1 month ago', type: 'max_weight' },
  { exercise: 'Squat', value: '120 kg', date: '3 weeks ago', type: 'max_weight' },
];

const recordIcons: Record<string, string> = {
  max_weight: '🏆',
  max_reps: '🔥',
  best_volume: '📊',
};

export function PersonalRecordsWidget() {
  return (
    <DashboardWidget title="Personal Records">
      <div className="space-y-3">
        {records.map((r, i) => (
          <motion.div
            key={r.exercise}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{recordIcons[r.type] || '🏆'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{r.exercise}</p>
              <p className="text-[10px] text-muted-foreground/60">{r.date}</p>
            </div>
            <span className="text-sm font-bold text-primary">{r.value}</span>
          </motion.div>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-muted py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/80">
        View all records <ArrowRight size={12} />
      </button>
    </DashboardWidget>
  );
}
