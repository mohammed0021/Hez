'use client';

import { useRequireAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MobileLayout } from '@/components/mobile-layout';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, TrendingUp, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useGamificationStore } from '@/stores/gamification-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export default function HomePage() {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const ta = useTranslations('auth');
  const router = useRouter();
  const { user, isLoading } = useRequireAuth();
  const totalWorkouts = useGamificationStore((s) => s.getTotalWorkouts());
  const totalVolume = useGamificationStore((s) => s.getTotalVolume());
  const currentStreak = useGamificationStore((s) => s.getCurrentStreak());
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const totalMinutes = sessions.reduce((acc, s) => {
    if (!s.startedAt || !s.completedAt) return acc;
    return (
      acc +
      Math.round((new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)
    );
  }, 0);

  if (isLoading) {
    return (
      <MobileLayout title="Hêz">
        <div className="pt-4">
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
    {
      label: t('stat_workouts'),
      value: totalWorkouts.toString(),
      icon: Dumbbell,
      color: 'text-primary',
    },
    {
      label: t('stat_minutes'),
      value: totalMinutes.toString(),
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      label: t('stat_streak'),
      value: t('stat_streak_value', { count: currentStreak }),
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: t('stat_volume'),
      value: `${totalVolume.toLocaleString()} ${tc('units_kg')}`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
  ];

  return (
    <MobileLayout title="Hêz">
      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-foreground text-2xl font-bold">
            {ta('login_title')}
            {user.user_metadata?.name
              ? t('greeting_suffix', { name: user.user_metadata.name.split(' ')[0] })
              : ''}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{t('motivation')}</p>
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
                className="bg-card border-border/50 rounded-2xl border p-4"
              >
                <Icon size={24} className={stat.color} />
                <p className="text-foreground mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                  {stat.label}
                </p>
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
          <h3 className="text-foreground mb-3 text-sm font-semibold">{t('quick_start')}</h3>
          <button
            onClick={() => router.push('/workouts')}
            className="bg-primary text-primary-foreground flex min-h-[44px] w-full items-center gap-4 rounded-2xl p-4"
          >
            <Dumbbell size={24} />
            <div className="text-left">
              <p className="font-semibold">{t('start_workout')}</p>
              <p className="text-sm opacity-80">{t('begin_session')}</p>
            </div>
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
