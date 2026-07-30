'use client';

import {
  Dumbbell,
  Plus,
  BookOpen,
  History,
  Scale,
  Calculator,
  Calendar,
  Pill,
  User,
  Settings,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    id: 'start-workout',
    icon: Dumbbell,
    label: 'Start Workout',
    href: '/workouts',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'create-workout',
    icon: Plus,
    label: 'Create Workout',
    href: '/workouts/new',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    id: 'exercises',
    icon: BookOpen,
    label: 'Exercise Library',
    href: '/exercises',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    id: 'history',
    icon: History,
    label: 'Workout History',
    href: '/workouts',
    color: 'bg-violet-500/10 text-violet-500',
  },
  {
    id: 'weight',
    icon: Scale,
    label: 'Log Weight',
    href: '/progress/weight',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 'bmi',
    icon: Calculator,
    label: 'BMI Calculator',
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
    id: 'supplements',
    icon: Pill,
    label: 'Supplements',
    href: '/supplements',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    id: 'progress',
    icon: BarChart3,
    label: 'Progress',
    href: '/progress',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'profile',
    icon: User,
    label: 'Profile',
    href: '/profile',
    color: 'bg-purple-500/10 text-purple-500',
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
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
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
