import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  NotificationTypeId,
  NotificationTypePrefs,
  NotificationStoreState,
} from '@/lib/notification-types';
import { NOTIFICATION_TYPES } from '@/lib/notification-types';

function buildDefaultPrefs(): Record<NotificationTypeId, NotificationTypePrefs> {
  const prefs = {} as Record<NotificationTypeId, NotificationTypePrefs>;
  for (const nt of NOTIFICATION_TYPES) {
    prefs[nt.id] = {
      enabled: nt.defaultEnabled,
      time: nt.defaultTime,
      daysOfWeek: nt.defaultDays,
      advanceMinutes: nt.defaultAdvanceMinutes,
    };
  }
  return prefs;
}

interface NotificationActions {
  setGlobalEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setPermissionRequested: (val: boolean) => void;
  setPushSubscription: (sub: PushSubscriptionJSON | null) => void;
  setQuietHours: (settings: Partial<{ enabled: boolean; start: string; end: string }>) => void;
  updateType: (id: NotificationTypeId, prefs: Partial<NotificationTypePrefs>) => void;
  resetType: (id: NotificationTypeId) => void;
  resetAll: () => void;
}

type NotifStore = NotificationStoreState & NotificationActions;

export const useNotificationStore = create<NotifStore>()(
  persist(
    (set) => ({
      globalEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      permissionRequested: false,
      pushSubscription: null,
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
      types: buildDefaultPrefs(),

      setGlobalEnabled: (enabled) => set({ globalEnabled: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),
      setPermissionRequested: (val) => set({ permissionRequested: val }),
      setPushSubscription: (sub) => set({ pushSubscription: sub }),

      setQuietHours: (settings) =>
        set((s) => ({ quietHours: { ...s.quietHours, ...settings } })),

      updateType: (id, prefs) =>
        set((s) => ({
          types: {
            ...s.types,
            [id]: { ...s.types[id], ...prefs },
          },
        })),

      resetType: (id) => {
        const nt = NOTIFICATION_TYPES.find((t) => t.id === id);
        if (!nt) return;
        set((s) => ({
          types: {
            ...s.types,
            [id]: {
              enabled: nt.defaultEnabled,
              time: nt.defaultTime,
              daysOfWeek: nt.defaultDays,
              advanceMinutes: nt.defaultAdvanceMinutes,
            },
          },
        }));
      },

      resetAll: () =>
        set({
          globalEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          permissionRequested: true,
          types: buildDefaultPrefs(),
        }),
    }),
    {
      name: 'hez-notification-store',
    },
  ),
);
