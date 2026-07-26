'use client';

import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/stores/notification-store';
import { getMessageForType, shouldNotify, notify } from '@/lib/notification-service';
import type { NotificationTypeId } from '@/lib/notification-types';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';
import { useSupplementStore } from '@/stores/supplement-store';

function getTimeMinutes(date?: Date): number {
  const d = date || new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function getDayOfWeek(date?: Date): number {
  return (date || new Date()).getDay();
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useNotificationScheduler() {
  const lastSentRef = useRef<Partial<Record<string, string>>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const store = useNotificationStore.getState();
    if (!store.globalEnabled) return;

    const check = () => {
      const now = new Date();
      const currentMinutes = getTimeMinutes(now);
      const day = getDayOfWeek(now);
      const todayKey = formatDate(now);

      const tryNotify = (type: NotificationTypeId, scheduledMinutes: number) => {
        if (!shouldNotify(type)) return;
        const typePrefs = useNotificationStore.getState().types[type];
        if (typePrefs?.daysOfWeek && !typePrefs.daysOfWeek.includes(day)) return;

        const key = `${type}-${todayKey}`;
        const sent = lastSentRef.current[key];
        const currentSlot = `${Math.floor(currentMinutes / 5) * 5}`;

        if (currentMinutes >= scheduledMinutes && currentMinutes < scheduledMinutes + 5 && sent !== currentSlot) {
          const msg = getMessageForType(type);
          if (msg) {
            notify(msg.title, { body: msg.body, tag: type, data: { type } });
            lastSentRef.current[key] = currentSlot;
          }
        }
      };

      const typeHasTime = (id: NotificationTypeId): string | undefined => {
        return useNotificationStore.getState().types[id]?.time;
      };

      const timeToMinutes = (t: string): number => {
        const [h, m] = t.split(':').map(Number);
        return h! * 60 + m!;
      };

      // Check each time-based type
      for (const type of ['workout_reminder', 'creatine_reminder', 'meal_reminder', 'sleep_reminder', 'workout_tomorrow_reminder'] as NotificationTypeId[]) {
        const t = typeHasTime(type);
        if (t) tryNotify(type, timeToMinutes(t));
      }

      // Pre-gym reminder checks typePrefs.time + advanceMinutes
      {
        const prefs = useNotificationStore.getState().types['pre_gym_reminder'];
        if (prefs?.enabled && prefs?.time && prefs?.advanceMinutes) {
          const scheduledTime = timeToMinutes(prefs.time);
          const triggerAt = scheduledTime - prefs.advanceMinutes;
          if (triggerAt >= 0 && triggerAt <= 1440) {
            tryNotify('pre_gym_reminder', triggerAt);
          }
        }
      }

      // Water reminder (uses existing hydration config)
      {
        const hyd = useNutritionGoalsStore.getState().hydration;
        const targetType = 'water_reminder';
        if (hyd.enabled && shouldNotify(targetType)) {
          const hour = now.getHours();
          if (hour >= hyd.startHour && hour < hyd.endHour) {
            if (currentMinutes % hyd.intervalMinutes === 0) {
              const key = `${targetType}-${todayKey}`;
              const sent = lastSentRef.current[key];
              const currentSlot = `${Math.floor(currentMinutes / hyd.intervalMinutes)}`;
              if (sent !== currentSlot) {
                notify('Hydration Reminder', {
                  body: `Time to drink ${hyd.amountMl}ml of water!`,
                  tag: targetType,
                  data: { type: targetType },
                });
                lastSentRef.current[key] = currentSlot;
              }
            }
          }
        }
      }

      // Supplement reminder (creatine specifically, but uses existing supplement config)
      {
        const suppStore = useSupplementStore.getState();
        const suppReminder = suppStore.reminder;
        const targetType = 'creatine_reminder';
        if (suppReminder.enabled && shouldNotify(targetType)) {
          const reminderMinutes = suppReminder.hour * 60 + suppReminder.minute;
          if (currentMinutes >= reminderMinutes && currentMinutes < reminderMinutes + 5) {
            const key = `${targetType}-creatine-${todayKey}`;
            const sent = lastSentRef.current[key];
            const currentSlot = `${Math.floor(currentMinutes / 5) * 5}`;
            if (sent !== currentSlot) {
              const creatine = suppStore.supplements.find((s) =>
                s.name.toLowerCase().includes('creatine'),
              );
              if (creatine) {
                const todayLog = suppStore.getTodayLog();
                if (todayLog[creatine.id] !== 'taken') {
                  notify('Creatine Reminder', {
                    body: `Don't forget to take your creatine!`,
                    tag: targetType,
                    data: { type: targetType, supplementId: creatine.id },
                    onClick: () => {
                      suppStore.markTaken(creatine.id);
                    },
                  });
                  lastSentRef.current[key] = currentSlot;
                }
              }
            }
          }
        }
      }

      // Weekly summary (Sundays, 19:00)
      if (day === 0 && currentMinutes >= 1140 && currentMinutes < 1145) {
        const type = 'weekly_summary' as const;
        if (shouldNotify(type)) {
          const key = `${type}-week-${getWeekNumber(now)}`;
          if (!lastSentRef.current[key]) {
            notify('Weekly Summary', {
              body: 'Your workout week is complete! Check your progress.',
              tag: type,
              data: { type },
            });
            lastSentRef.current[key] = 'sent';
          }
        }
      }

      // Monthly summary (1st of month, 09:00)
      if (now.getDate() === 1 && currentMinutes >= 540 && currentMinutes < 545) {
        const type = 'monthly_summary' as const;
        if (shouldNotify(type)) {
          const key = `${type}-${now.getFullYear()}-${now.getMonth()}`;
          if (!lastSentRef.current[key]) {
            notify('Monthly Summary', {
              body: 'Your monthly progress report is ready!',
              tag: type,
              data: { type },
            });
            lastSentRef.current[key] = 'sent';
          }
        }
      }
    };

    check();
    intervalRef.current = setInterval(check, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
}

function getWeekNumber(d: Date): number {
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - startOfYear.getTime();
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}
