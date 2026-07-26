'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Dumbbell, Award, Zap, Target, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/stores/ui-store';
import { useUiStore } from '@/stores/ui-store';
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
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const TypeIcon = typeIcons[notification.type] || Bell;

  return (
    <button
      onClick={() => markAsRead(notification.id)}
      className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
        !notification.read ? 'bg-primary/[0.03]' : ''
      }`}
    >
      <div className={`mt-0.5 shrink-0 ${typeColors[notification.type] || 'text-muted-foreground'}`}>
        <TypeIcon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!notification.read ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notification.body}</p>
        )}
        <p className="mt-1 text-[10px] text-muted-foreground/60">
          {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!notification.read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

export function NotificationCenter() {
  const { notificationOpen, setNotificationOpen } = useUiStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();

  return (
    <div className="relative">
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[17px] items-center justify-center rounded-full bg-primary px-1 py-0.5 text-[9px] font-bold text-primary-foreground leading-none">
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
              className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-border/50 bg-background shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
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
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
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
