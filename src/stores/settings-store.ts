import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      Omit<SettingsState, 'setLanguage' | 'setUnitSystem' | 'updateSettings' | 'reset'>
    >,
  ) => void;
  reset: () => void;
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

      setLanguage: (language) => set({ language }),
      setUnitSystem: (system) => {
        if (system === 'imperial') {
          set({ unitSystem: 'imperial', weightUnit: 'lbs', heightUnit: 'ft_in', waterUnit: 'oz' });
        } else {
          set({ unitSystem: 'metric', weightUnit: 'kg', heightUnit: 'cm', waterUnit: 'ml' });
        }
      },
      updateSettings: (data) => set((s) => ({ ...s, ...data })),
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
