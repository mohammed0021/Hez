'use client';

import { Play, Plus, Apple, Camera, Scale, Target } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    id: 'workout',
    icon: Play,
    label: 'Start Workout',
    color: 'bg-primary text-primary-foreground',
    href: '/workouts',
  },
  {
    id: 'meal',
    icon: Plus,
    label: 'Log Meal',
    color: 'bg-blue-500/10 text-blue-500',
    href: '/nutrition',
  },
  {
    id: 'weight',
    icon: Scale,
    label: 'Log Weight',
    color: 'bg-green-500/10 text-green-500',
    href: '/progress/weight',
  },
  {
    id: 'photo',
    icon: Camera,
    label: 'Progress Pic',
    color: 'bg-purple-500/10 text-purple-500',
    href: '/progress/photos',
  },
  {
    id: 'water',
    icon: Apple,
    label: 'Log Water',
    color: 'bg-cyan-500/10 text-cyan-500',
    href: '/nutrition',
  },
  {
    id: 'goal',
    icon: Target,
    label: 'Set Goal',
    color: 'bg-orange-500/10 text-orange-500',
    href: '/profile',
  },
];

export function QuickActionsWidget() {
  return (
    <div className="bg-card border-border/50 rounded-2xl border p-4">
      <h3 className="text-foreground mb-3 text-sm font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.id}
              href={a.href}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-all hover:scale-105 active:scale-95 ${a.color}`}
            >
              <Icon size={18} />
              {a.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
