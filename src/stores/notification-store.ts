import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';
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

function syncPrefsToServer(
  prefs: Record<NotificationTypeId, NotificationTypePrefs>,
  extra: Partial<NotificationStoreState>,
) {
  try {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const serializable = {
        globalEnabled: extra.globalEnabled ?? true,
        soundEnabled: extra.soundEnabled ?? true,
        vibrationEnabled: extra.vibrationEnabled ?? true,
        quietHours: extra.quietHours ?? { enabled: false, start: '22:00', end: '07:00' },
        types: prefs,
      };
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      supabase
        .from('settings')
        .update({ notification_prefs: serializable, timezone })
        .eq('user_id', user.id);
    });
  } catch {}
}

export async function syncNotificationPrefsFromServer(): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: settings } = await supabase
      .from('settings')
      .select('notification_prefs, timezone')
      .eq('user_id', user.id)
      .single();
    if (settings?.notification_prefs) {
      const prefs = settings.notification_prefs as {
        globalEnabled?: boolean;
        soundEnabled?: boolean;
        vibrationEnabled?: boolean;
        quietHours?: NotificationStoreState['quietHours'];
        types?: Partial<Record<NotificationTypeId, NotificationTypePrefs>>;
      };
      useNotificationStore.setState({
        globalEnabled: prefs.globalEnabled ?? true,
        soundEnabled: prefs.soundEnabled ?? true,
        vibrationEnabled: prefs.vibrationEnabled ?? true,
        quietHours: prefs.quietHours ?? { enabled: false, start: '22:00', end: '07:00' },
        types: {
          ...useNotificationStore.getState().types,
          ...prefs.types,
        },
      });
    }
  } catch {}
}

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

      setGlobalEnabled: (enabled) => {
        set({ globalEnabled: enabled });
        syncPrefsToServer(useNotificationStore.getState().types, { globalEnabled: enabled });
      },
      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
        syncPrefsToServer(useNotificationStore.getState().types, { soundEnabled: enabled });
      },
      setVibrationEnabled: (enabled) => {
        set({ vibrationEnabled: enabled });
        syncPrefsToServer(useNotificationStore.getState().types, { vibrationEnabled: enabled });
      },
      setPermissionRequested: (val) => set({ permissionRequested: val }),
      setPushSubscription: (sub) => set({ pushSubscription: sub }),

      setQuietHours: (settings) => {
        const next = { ...useNotificationStore.getState().quietHours, ...settings };
        set({ quietHours: next });
        syncPrefsToServer(useNotificationStore.getState().types, { quietHours: next });
      },

      updateType: (id, prefs) => {
        const nextTypes = {
          ...useNotificationStore.getState().types,
          [id]: { ...useNotificationStore.getState().types[id], ...prefs },
        };
        set({ types: nextTypes });
        syncPrefsToServer(nextTypes, {});
      },

      resetType: (id) => {
        const nt = NOTIFICATION_TYPES.find((t) => t.id === id);
        if (!nt) return;
        const nextTypes = {
          ...useNotificationStore.getState().types,
          [id]: {
            enabled: nt.defaultEnabled,
            time: nt.defaultTime,
            daysOfWeek: nt.defaultDays,
            advanceMinutes: nt.defaultAdvanceMinutes,
          },
        };
        set({ types: nextTypes });
        syncPrefsToServer(nextTypes, {});
      },

      resetAll: () => {
        const types = buildDefaultPrefs();
        set({
          globalEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          permissionRequested: true,
          types,
        });
        syncPrefsToServer(types, {});
      },
    }),
    {
      name: 'hez-notification-store',
    },
  ),
);
