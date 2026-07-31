'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNotificationStore } from '@/stores/notification-store';
import {
  isNotificationSupported,
  isPushSupported,
  requestPermission,
  subscribeToPush,
} from '@/lib/notification-service';

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');

  useEffect(() => {
    const store = useNotificationStore.getState();
    if (!store.globalEnabled) return;
    if (store.permissionRequested) return;
    if (!isNotificationSupported()) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    try {
      const result = await requestPermission();
      if (result === 'granted' && isPushSupported()) {
        await subscribeToPush();
      }
    } finally {
      setVisible(false);
      setBusy(false);
    }
  };

  const handleDismiss = () => {
    useNotificationStore.getState().setPermissionRequested(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-20 z-50 max-w-xs md:bottom-6">
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xl">
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:bg-muted absolute top-3 right-3 flex size-7 items-center justify-center rounded-lg"
          aria-label={t('dismiss')}
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
            <Bell size={16} />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">{t('enable_notifications')}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{t('enable_prompt')}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleEnable}
            disabled={busy}
            className="bg-primary text-primary-foreground min-h-[40px] flex-1 rounded-xl py-2 text-xs font-medium disabled:opacity-60"
          >
            {busy ? t('enabling') : t('allow_notifications')}
          </button>
          <button
            onClick={handleDismiss}
            className="border-border text-muted-foreground hover:bg-muted min-h-[40px] rounded-xl border px-3 text-xs font-medium"
          >
            {tCommon('not_now')}
          </button>
        </div>
      </div>
    </div>
  );
}
