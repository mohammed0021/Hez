'use client';

import { motion } from 'framer-motion';
import {
  Scale, Camera, Trophy, TrendingUp,
  ChevronRight, BrainCircuit, Weight, Ruler,
} from 'lucide-react';
import Link from 'next/link';

const cards = [
  { icon: Weight, label: 'Weight Tracker', desc: 'Log and chart body weight', href: '/progress/weight', color: 'bg-blue-500/10 text-blue-500' },
  { icon: Scale, label: 'BMI Calculator', desc: 'Calculate your BMI', href: '/progress/bmi', color: 'bg-green-500/10 text-green-500' },
  { icon: Ruler, label: 'Measurements', desc: 'Track body measurements', href: '/progress/measurements', color: 'bg-purple-500/10 text-purple-500' },
  { icon: Camera, label: 'Progress Photos', desc: 'Before/after comparisons', href: '/progress/photos', color: 'bg-pink-500/10 text-pink-500' },
  { icon: BrainCircuit, label: 'Analytics', desc: 'Smart analysis & heatmaps', href: '/progress/analytics', color: 'bg-primary/10 text-primary' },
  { icon: Trophy, label: 'Personal Records', desc: 'Your best lifts', href: '/progress/records', color: 'bg-amber-500/10 text-amber-500' },
  { icon: TrendingUp, label: 'Strength Trends', desc: 'Strength progression', href: '/progress/strength', color: 'bg-rose-500/10 text-rose-500' },
];

export default function ProgressHubPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Track your fitness journey</p>
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={card.href}
                className="flex items-center gap-4 rounded-2xl bg-card border border-border/50 p-4 hover:border-primary/30 transition-colors"
              >
                <div className={`flex size-10 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{card.desc}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
