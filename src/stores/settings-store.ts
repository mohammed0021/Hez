import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';
import { useThemeStore } from './theme-store';

export type UnitSystem = 'metric' | 'imperial';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';
export type WaterUnit = 'ml' | 'oz';

export interface SettingsState {
  language: string;
  unitSystem: UnitSystem;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  waterUnit: WaterUnit;
  defaultRestTimer: number;
  autoStartRestTimer: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;

  setLanguage: (language: string) => void;
  setUnitSystem: (system: UnitSystem) => void;
  updateSettings: (
    data: Partial<
      Omit<
        SettingsState,
        'setLanguage' | 'setUnitSystem' | 'updateSettings' | 'reset' | 'syncFromServer'
      >
    >,
  ) => Promise<void>;
  reset: () => void;
  syncFromServer: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      unitSystem: 'metric',
      weightUnit: 'kg',
      heightUnit: 'cm',
      waterUnit: 'ml',
      defaultRestTimer: 90,
      autoStartRestTimer: true,
      soundEnabled: true,
      vibrationEnabled: true,

      setLanguage: (language) => {
        set({ language });
        try {
          const supabase = createClient();
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) supabase.from('settings').update({ language }).eq('user_id', user.id);
          });
        } catch {}
      },

      setUnitSystem: (system) => {
        if (system === 'imperial') {
          set({ unitSystem: 'imperial', weightUnit: 'lbs', heightUnit: 'ft_in', waterUnit: 'oz' });
        } else {
          set({ unitSystem: 'metric', weightUnit: 'kg', heightUnit: 'cm', waterUnit: 'ml' });
        }
        try {
          const supabase = createClient();
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user)
              supabase
                .from('settings')
                .update({ measurement_system: system })
                .eq('user_id', user.id);
          });
        } catch {}
      },

      updateSettings: async (data) => {
        set((s) => ({ ...s, ...data }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const updates: Record<string, unknown> = {};
            if (data.defaultRestTimer !== undefined)
              updates.rest_timer_default = data.defaultRestTimer;
            if (data.soundEnabled !== undefined) updates.notifications_enabled = data.soundEnabled;
            if (data.language !== undefined) updates.language = data.language;
            if (Object.keys(updates).length > 0) {
              await supabase.from('settings').update(updates).eq('user_id', user.id);
            }
          }
        } catch (e) {
          console.error('Failed to sync settings to server:', e);
        }
      },

      reset: () =>
        set({
          language: 'en',
          unitSystem: 'metric',
          weightUnit: 'kg',
          heightUnit: 'cm',
          waterUnit: 'ml',
          defaultRestTimer: 90,
          autoStartRestTimer: true,
          soundEnabled: true,
          vibrationEnabled: true,
        }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data: settings } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (settings) {
            set({
              language: settings.language || 'en',
              unitSystem: (settings.measurement_system as UnitSystem) || 'metric',
              defaultRestTimer: settings.rest_timer_default || 90,
              soundEnabled: settings.notifications_enabled ?? true,
            });
            const themeStore = useThemeStore.getState();
            if (settings.theme_id) themeStore.setThemeId(settings.theme_id as never);
            if (settings.theme_mode) themeStore.setMode(settings.theme_mode as never);
          }
        } catch (e) {
          console.error('Failed to sync settings from server:', e);
        }
      },
    }),
    {
      name: 'hez-settings',
      partialize: (s) => ({
        language: s.language,
        unitSystem: s.unitSystem,
        weightUnit: s.weightUnit,
        heightUnit: s.heightUnit,
        waterUnit: s.waterUnit,
        defaultRestTimer: s.defaultRestTimer,
        autoStartRestTimer: s.autoStartRestTimer,
        soundEnabled: s.soundEnabled,
        vibrationEnabled: s.vibrationEnabled,
      }),
    },
  ),
);
