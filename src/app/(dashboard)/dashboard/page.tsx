'use client';

import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profile-store';
import { useAuthStore } from '@/stores/auth-store';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TodaysWorkout } from '@/components/dashboard/todays-workout';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { WeightWidget } from '@/components/dashboard/weight-widget';
import { CaloriesWidget } from '@/components/dashboard/calories-widget';
import { ProteinWidget } from '@/components/dashboard/protein-widget';
import { WaterWidget } from '@/components/dashboard/water-widget';
import { RecentActivityWidget } from '@/components/dashboard/recent-activity-widget';
import { AchievementWidget } from '@/components/dashboard/achievement-widget';

const stagger = 0.04;

export default function DashboardPage() {
  const displayName = useProfileStore((s) => s.displayName);
  const user = useAuthStore((s) => s.user);
  const name = displayName || user?.user_metadata?.full_name || 'there';

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const section = (child: React.ReactNode, delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {child}
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-3 pb-4">
      {section(
        <div className="bg-card border-border/50 rounded-2xl border p-5">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {greeting}, {name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{dateStr}</p>
        </div>,
        stagger * 0,
      )}

      {section(<QuickActions />, stagger * 1)}

      {section(<TodaysWorkout />, stagger * 2)}

      {section(<StreakWidget />, stagger * 3)}

      {section(<WeightWidget />, stagger * 4)}

      {section(
        <details className="group border-border/50 bg-card overflow-hidden rounded-2xl border">
          <summary className="text-foreground flex cursor-pointer items-center justify-between p-4 text-sm font-semibold">
            Nutrition Summary
            <svg
              className="text-muted-foreground size-4 transition-transform group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              <CaloriesWidget />
              <ProteinWidget />
              <WaterWidget />
            </div>
          </div>
        </details>,
        stagger * 5,
      )}

      {section(
        <details className="group border-border/50 bg-card overflow-hidden rounded-2xl border">
          <summary className="text-foreground flex cursor-pointer items-center justify-between p-4 text-sm font-semibold">
            Recent Activity
            <svg
              className="text-muted-foreground size-4 transition-transform group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="px-4 pb-4">
            <RecentActivityWidget />
          </div>
        </details>,
        stagger * 6,
      )}

      {section(
        <details className="group border-border/50 bg-card overflow-hidden rounded-2xl border">
          <summary className="text-foreground flex cursor-pointer items-center justify-between p-4 text-sm font-semibold">
            Achievements
            <svg
              className="text-muted-foreground size-4 transition-transform group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="px-4 pb-4">
            <AchievementWidget />
          </div>
        </details>,
        stagger * 7,
      )}
    </div>
  );
}
