'use client';

import {
  Dumbbell,
  Scale,
  Apple,
  Droplets,
  Camera,
  Calculator,
  Calendar,
  BookOpen,
  Pill,
  Target,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    id: 'workout',
    icon: Dumbbell,
    label: 'Start Workout',
    href: '/workouts',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'weight',
    icon: Scale,
    label: 'Log Weight',
    href: '/progress/weight',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 'meal',
    icon: Apple,
    label: 'Log Meal',
    href: '/nutrition/meals',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    id: 'water',
    icon: Droplets,
    label: 'Log Water',
    href: '/nutrition',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'photos',
    icon: Camera,
    label: 'Progress Photos',
    href: '/progress/photos',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'bmi',
    icon: Calculator,
    label: 'BMI',
    href: '/progress/bmi',
    color: 'bg-teal-500/10 text-teal-500',
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Calendar',
    href: '/calendar',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    id: 'exercises',
    icon: BookOpen,
    label: 'Exercises',
    href: '/exercises',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    id: 'supplements',
    icon: Pill,
    label: 'Supplements',
    href: '/supplements',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    id: 'goals',
    icon: Target,
    label: 'Goals',
    href: '/nutrition/goals',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    color: 'bg-gray-500/10 text-gray-500',
  },
];

export function QuickActions() {
  return (
    <div className="border-border/50 bg-card rounded-2xl border p-4">
      <h3 className="text-foreground mb-3 text-sm font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.id}
              href={a.href}
              className="hover:bg-muted/50 active:bg-muted flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors"
            >
              <div className={`flex size-10 items-center justify-center rounded-full ${a.color}`}>
                <Icon size={18} />
              </div>
              <span className="text-foreground text-center text-[10px] leading-tight font-medium">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
