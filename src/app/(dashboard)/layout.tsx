'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { NotificationPermissionPrompt } from '@/components/notification-permission-prompt';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationScheduler } from '@/lib/use-notification-scheduler';
import { useGamificationSync } from '@/lib/use-gamification-sync';
import { useSettingsStore } from '@/stores/settings-store';
import { useProfileStore } from '@/stores/profile-store';
import { useWeightStore } from '@/stores/weight-store';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';
import { syncNotificationPrefsFromServer } from '@/stores/notification-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useNotificationScheduler();
  useGamificationSync();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    useSettingsStore.getState().syncFromServer();
    useProfileStore.getState().syncFromServer();
    useWeightStore.getState().syncFromServer();
    useWorkoutHistoryStore.getState().syncFromServer();
    syncNotificationPrefsFromServer();
  }, [user, isLoading, router]);

  return (
    <>
      <NotificationPermissionPrompt />
      <AppShell>{children}</AppShell>
    </>
  );
}
