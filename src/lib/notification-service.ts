'use client';

import type { NotificationTypeId } from '@/lib/notification-types';
import { useNotificationStore } from '@/stores/notification-store';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  const result = await Notification.requestPermission();
  useNotificationStore.getState().setPermissionRequested(true);
  return result;
}

export async function getPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  if (Notification.permission === 'default') {
    return await requestPermission();
  }
  return Notification.permission;
}

export function canNotify(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

function isInQuietHours(): boolean {
  const { quietHours } = useNotificationStore.getState();
  if (!quietHours.enabled) return false;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = quietHours.start.split(':').map(Number);
  const [eh, em] = quietHours.end.split(':').map(Number);
  const start = sh! * 60 + sm!;
  const end = eh! * 60 + em!;
  if (start <= end) {
    return current >= start && current < end;
  }
  return current >= start || current < end;
}

export function shouldNotify(type: NotificationTypeId): boolean {
  const state = useNotificationStore.getState();
  if (!state.globalEnabled) return false;
  const prefs = state.types[type];
  if (!prefs || !prefs.enabled) return false;
  if (isInQuietHours()) return false;
  if (!canNotify()) return false;
  return true;
}

export function notify(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
    data?: Record<string, unknown>;
    actions?: { action: string; title: string; icon?: string }[];
    onClick?: () => void;
    vibrate?: boolean;
  },
) {
  if (!canNotify()) return;
  const state = useNotificationStore.getState();
  const n = new Notification(title, {
    body: options?.body,
    icon: options?.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: options?.tag,
    requireInteraction: options?.requireInteraction ?? true,
    data: options?.data,
    vibrate: options?.vibrate !== false && state.vibrationEnabled ? [200, 100, 200] : undefined,
  } as NotificationOptions & { actions?: { action: string; title: string; icon?: string }[] });
  if (options?.onClick) {
    n.onclick = () => {
      window.focus();
      options.onClick!();
    };
  }
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const permission = await getPermission();
  if (permission !== 'granted') return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      useNotificationStore.getState().setPushSubscription(subscription.toJSON());
      return subscription;
    }

    const publicKey = await fetchPushPublicKey();
    if (!publicKey) return null;

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey as unknown as BufferSource,
    });

    useNotificationStore.getState().setPushSubscription(subscription.toJSON());

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    });

    return subscription;
  } catch {
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await fetch('/api/push/subscribe', { method: 'DELETE' });
    }
    useNotificationStore.getState().setPushSubscription(null);
    return true;
  } catch {
    return false;
  }
}

async function fetchPushPublicKey(): Promise<Uint8Array | null> {
  try {
    const res = await fetch('/api/push/public-key');
    const data = await res.json();
    if (!data.publicKey) return null;
    return urlBase64ToUint8Array(data.publicKey);
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getMessageForType(
  type: NotificationTypeId,
): { title: string; body: string } | null {
  const state = useNotificationStore.getState();
  const prefs = state.types[type];
  if (!prefs || !prefs.enabled || !state.globalEnabled) return null;

  switch (type) {
    case 'workout_reminder':
      return { title: 'Time to Work Out!', body: "Your daily workout is waiting — let's go!" };
    case 'pre_gym_reminder':
      return { title: 'Gym Prep Time', body: 'Your workout starts soon — get ready!' };
    case 'creatine_reminder':
      return { title: 'Creatine Time', body: "Don't forget to take your creatine today." };
    case 'sleep_reminder':
      return { title: 'Wind Down', body: 'Time to start winding down and prepare for sleep.' };
    case 'rest_timer_alert':
      return { title: 'Rest Over!', body: 'Time for your next set.' };
    case 'workout_tomorrow_reminder':
      return {
        title: 'Workout Tomorrow',
        body: "Don't forget — you have a workout scheduled for tomorrow!",
      };
    case 'weekly_summary':
      return { title: 'Weekly Summary', body: 'Check out your progress this week.' };
    case 'monthly_summary':
      return { title: 'Monthly Summary', body: 'Your monthly progress report is ready.' };
    case 'achievement_unlocked':
      return {
        title: 'Achievement Unlocked',
        body: 'You earned a new achievement! Check your progress.',
      };
  }
}

/**
 * Send a notification through Web Push (server-delivered) so it reaches the
 * user even when the tab/app is closed. Requires an active push subscription.
 */
export async function sendPushNotification(payload: {
  title: string;
  body?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
}): Promise<void> {
  if (!isPushSupported()) return;
  const state = useNotificationStore.getState();
  if (!state.globalEnabled || !state.pushSubscription) return;

  try {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        body: payload.body,
        tag: payload.tag,
        data: { ...(payload.data || {}), url: payload.url || '/' },
      }),
    });
  } catch {
    // Push delivery is best-effort
  }
}

export function getNotificationUrl(type: NotificationTypeId): string {
  switch (type) {
    case 'workout_reminder':
    case 'pre_gym_reminder':
    case 'workout_tomorrow_reminder':
      return '/workouts';
    case 'rest_timer_alert':
      return '/workouts/active';
    case 'creatine_reminder':
      return '/supplements';
    case 'sleep_reminder':
      return '/settings';
    case 'weekly_summary':
    case 'monthly_summary':
      return '/progress';
    case 'achievement_unlocked':
      return '/gamification';
  }
}
