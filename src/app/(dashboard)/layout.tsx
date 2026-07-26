'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationScheduler } from '@/lib/use-notification-scheduler';
import { useGamificationSync } from '@/lib/use-gamification-sync';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useNotificationScheduler();
  useGamificationSync();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  return <AppShell>{children}</AppShell>;
}
