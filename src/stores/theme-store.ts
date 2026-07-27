import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';
import type { ThemeId, ThemeMode } from '@/types/theme';

interface ThemeState {
  themeId: ThemeId;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  setResolvedMode: (mode: 'light' | 'dark') => void;
}

function syncToSupabase(data: { theme_id?: string; theme_mode?: string }) {
  try {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('settings').upsert({ user_id: user.id, ...data }, { onConflict: 'user_id' });
      }
    });
  } catch {}
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'hez-green' as ThemeId,
      mode: 'system' as ThemeMode,
      resolvedMode: 'dark' as 'light' | 'dark',
      setThemeId: (themeId) => {
        set({ themeId });
        syncToSupabase({ theme_id: themeId });
      },
      setMode: (mode) => {
        set({ mode });
        syncToSupabase({ theme_mode: mode });
      },
      setResolvedMode: (resolvedMode) => set({ resolvedMode }),
    }),
    {
      name: 'hez-theme',
      partialize: (state) => ({ themeId: state.themeId, mode: state.mode }),
    },
  ),
);
