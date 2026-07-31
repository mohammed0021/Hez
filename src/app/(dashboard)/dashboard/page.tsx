'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useProfileStore } from '@/stores/profile-store';
import { useAuthStore } from '@/stores/auth-store';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TodaysWorkout } from '@/components/dashboard/todays-workout';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { WeightWidget } from '@/components/dashboard/weight-widget';
import { BMIDisplay } from '@/components/dashboard/bmi-display';
import { WeeklyProgress } from '@/components/dashboard/weekly-progress';
import { RecentWorkouts } from '@/components/dashboard/recent-workouts';

const stagger = 0.04;

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const displayName = useProfileStore((s) => s.displayName);
  const user = useAuthStore((s) => s.user);
  const name = displayName || user?.user_metadata?.full_name || 'there';

  const now = new Date();
  const hour = now.getHours();
  const greetingKey = hour < 12 ? 'good_morning' : hour < 18 ? 'good_afternoon' : 'good_evening';
  const greeting = t(greetingKey);
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
            {greeting}
            {t('greeting_suffix', { name })}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{dateStr}</p>
        </div>,
        stagger * 0,
      )}

      {section(<QuickActions />, stagger * 1)}

      {section(<TodaysWorkout />, stagger * 2)}

      <div className="grid grid-cols-2 gap-3">
        {section(<StreakWidget />, stagger * 3)}
        {section(<WeightWidget />, stagger * 4)}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {section(<BMIDisplay />, stagger * 5)}
        {section(<WeeklyProgress />, stagger * 6)}
      </div>

      {section(<RecentWorkouts />, stagger * 7)}
    </div>
  );
}
