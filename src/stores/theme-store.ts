import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeId, ThemeMode } from '@/types/theme';

interface ThemeState {
  themeId: ThemeId;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  setResolvedMode: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'hez-green' as ThemeId,
      mode: 'system' as ThemeMode,
      resolvedMode: 'dark' as 'light' | 'dark',
      setThemeId: (themeId) => set({ themeId }),
      setMode: (mode) => set({ mode }),
      setResolvedMode: (resolvedMode) => set({ resolvedMode }),
    }),
    {
      name: 'hez-theme',
      partialize: (state) => ({ themeId: state.themeId, mode: state.mode }),
    },
  ),
);
