'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Dumbbell, Award, Zap, Target, CheckCheck } from 'lucide-react';
import { useInAppNotificationStore, useUiStore } from '@/stores/ui-store';
import { useTranslations } from 'next-intl';
import type { Notification } from '@/types';

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  workout_reminder: Dumbbell,
  achievement_unlocked: Award,
  challenge: Zap,
  progress: Target,
  system: Bell,
};

const typeColors: Record<string, string> = {
  workout_reminder: 'text-primary',
  achievement_unlocked: 'text-yellow-500',
  challenge: 'text-orange-500',
  progress: 'text-green-500',
  system: 'text-blue-500',
};

function NotificationItem({ notification }: { notification: Notification }) {
  const markAsRead = useInAppNotificationStore((s) => s.markAsRead);
  const TypeIcon = typeIcons[notification.type] || Bell;

  return (
    <button
      onClick={() => markAsRead(notification.id)}
      className={`hover:bg-muted/50 flex w-full gap-3 px-4 py-3 text-left transition-colors ${
        !notification.read ? 'bg-primary/[0.03]' : ''
      }`}
    >
      <div
        className={`mt-0.5 shrink-0 ${typeColors[notification.type] || 'text-muted-foreground'}`}
      >
        <TypeIcon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${!notification.read ? 'text-foreground font-semibold' : 'text-foreground/80'}`}
        >
          {notification.title}
        </p>
        {notification.body && (
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{notification.body}</p>
        )}
        <p className="text-muted-foreground/60 mt-1 text-[10px]">
          {new Date(notification.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      {!notification.read && <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />}
    </button>
  );
}

export function NotificationCenter() {
  const { notificationOpen, setNotificationOpen } = useUiStore();
  const { notifications, unreadCount, markAllAsRead } = useInAppNotificationStore();
  const t = useTranslations('notifications');

  return (
    <div className="relative">
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="text-muted-foreground hover:bg-muted relative flex size-9 items-center justify-center rounded-xl transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex min-w-[17px] items-center justify-center rounded-full px-1 py-0.5 text-[9px] leading-none font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {notificationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setNotificationOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="border-border/50 bg-background absolute top-full right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border shadow-xl"
            >
              <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-foreground text-sm font-semibold">{t('title')}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10">
                    <Bell size={24} className="text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
