'use client';

import { useRequireAuth } from '@/hooks/use-auth';
import { MobileLayout } from '@/components/mobile-layout';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, TrendingUp, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';

export default function HomePage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <MobileLayout title="Hêz">
        <div className="px-4 pt-4">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="mb-6 h-4 w-32" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout title="Hêz">
        <ErrorState onRetry={() => window.location.reload()} />
      </MobileLayout>
    );
  }

  const stats = [
    { label: 'Workouts', value: '0', icon: Dumbbell, color: 'text-primary' },
    { label: 'Minutes', value: '0', icon: Activity, color: 'text-blue-500' },
    { label: 'Streak', value: '0 days', icon: Flame, color: 'text-orange-500' },
    { label: 'Volume', value: '0 kg', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <MobileLayout title="Hêz">
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back{user.user_metadata?.name ? `, ${user.user_metadata.name.split(' ')[0]}` : ''}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Let&apos;s crush your goals today</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-2xl bg-card p-4 border border-border/50"
              >
                <Icon size={24} className={stat.color} />
                <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h3 className="mb-3 text-lg font-semibold text-foreground">Quick Start</h3>
          <button className="flex w-full items-center gap-4 rounded-2xl bg-primary p-4 text-primary-foreground">
            <Dumbbell size={24} />
            <div className="text-left">
              <p className="font-semibold">Start a Workout</p>
              <p className="text-sm opacity-80">Begin a new training session</p>
            </div>
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
