import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getAllSubscriptions } from '@/lib/push-store';
import type { NotificationTypeId } from '@/lib/notification-types';

export const dynamic = 'force-dynamic';

const MESSAGES: Record<NotificationTypeId, { title: string; body: string }> = {
  workout_reminder: {
    title: 'Time to Work Out!',
    body: "Your daily workout is waiting — let's go!",
  },
  pre_gym_reminder: { title: 'Gym Prep Time', body: 'Your workout starts soon — get ready!' },
  creatine_reminder: { title: 'Creatine Time', body: "Don't forget to take your creatine today." },
  sleep_reminder: { title: 'Wind Down', body: 'Time to start winding down and prepare for sleep.' },
  rest_timer_alert: { title: 'Rest Over!', body: 'Time for your next set.' },
  workout_tomorrow_reminder: {
    title: 'Workout Tomorrow',
    body: "Don't forget — you have a workout scheduled for tomorrow!",
  },
  weekly_summary: { title: 'Weekly Summary', body: 'Check out your progress this week.' },
  monthly_summary: { title: 'Monthly Summary', body: 'Your monthly progress report is ready.' },
  achievement_unlocked: {
    title: 'Achievement Unlocked',
    body: 'You earned a new achievement! Check your progress.',
  },
};

/**
 * Server-side scheduler: delivers due push notifications even when the app is
 * closed. Called by a Vercel Cron job every 15 minutes.
 *
 * Reads each user's persisted notification prefs + timezone from the settings
 * table, computes what is due in their local time, and sends via Web Push.
 */
export async function GET() {
  const auth = process.env.CRON_SECRET;
  const secret = process.env.CRON_SECRET;
  if (!secret || (auth && auth !== secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: settingsRows } = await supabase
      .from('settings')
      .select('user_id, timezone, notification_prefs, workout_reminders, notifications_enabled')
      .not('notification_prefs', 'is', null);

    const subscriptions = await getAllSubscriptions();
    const subMap = new Map<string, PushSubscriptionJSON>();
    for (const sub of subscriptions) {
      if (sub.endpoint && !subMap.has(sub.endpoint)) subMap.set(sub.endpoint, sub);
    }
    if (subMap.size === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const sent: Array<{ title: string; body?: string }> = [];
    const windowMin = 15;

    for (const row of settingsRows ?? []) {
      if (row.notifications_enabled === false) continue;
      const prefs = (row.notification_prefs || {}) as {
        globalEnabled?: boolean;
        types?: Record<NotificationTypeId, { enabled: boolean; time?: string }>;
      };
      if (prefs.globalEnabled === false) continue;
      const types = (prefs.types || {}) as Partial<
        Record<NotificationTypeId, { enabled?: boolean; time?: string }>
      >;
      const nowLocal = adjustToTimezone(now, row.timezone || 'UTC');
      const minutesLocal = nowLocal.getHours() * 60 + nowLocal.getMinutes();

      for (const type of [
        'workout_reminder',
        'creatine_reminder',
        'sleep_reminder',
        'workout_tomorrow_reminder',
      ] as NotificationTypeId[]) {
        const t = types[type];
        if (!t?.enabled || !t.time) continue;
        const [h, m] = t.time.split(':').map(Number);
        const scheduled = h! * 60 + m!;
        if (minutesLocal >= scheduled && minutesLocal < scheduled + windowMin) {
          const msg = MESSAGES[type];
          if (msg) {
            sent.push(msg);
            break;
          }
        }
      }
    }

    if (sent.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const { default: webpush } = await import('web-push');
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:hez@example.com',
      process.env.VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || '',
    );

    let sentCount = 0;
    const payload = sent[0]!;
    const results = await Promise.allSettled(
      Array.from(subMap.values()).map((sub) =>
        webpush.sendNotification(
          sub as unknown as { endpoint: string; keys: { p256dh: string; auth: string } },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: '/icons/icon-192x192.png',
            tag: `daily-${todayKey}`,
            data: { url: '/' },
          }),
        ),
      ),
    );
    sentCount = results.filter((r) => r.status === 'fulfilled').length;

    return NextResponse.json({ ok: true, sent: sentCount, total: subMap.size });
  } catch (error) {
    console.error('[cron/reminders] Failed:', error);
    return NextResponse.json({ ok: false, error: 'Failed' }, { status: 500 });
  }
}

function adjustToTimezone(date: Date, timezone: string): Date {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    }).formatToParts(date);

    const get = (type: string) => parts.find((p) => p.type === type)?.value || '0';
    const hour = parseInt(get('hour'), 10);
    const minute = parseInt(get('minute'), 10);
    const weekday = get('weekday');
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);
    d.setDate(d.getDate() + ((dayMap[weekday]! - d.getDay() + 7) % 7));
    return d;
  } catch {
    return date;
  }
}
