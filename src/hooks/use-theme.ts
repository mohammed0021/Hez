'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function useTheme() {
  const { themeId, mode, resolvedMode, setThemeId, setMode, setResolvedMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', themeId);

    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const systemMode = mq.matches ? 'dark' : 'light';
      root.classList.add(systemMode);
      setResolvedMode(systemMode);

      const handler = (e: MediaQueryListEvent) => {
        const newMode = e.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newMode);
        setResolvedMode(newMode);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      root.classList.add(mode);
      setResolvedMode(mode);
    }
  }, [themeId, mode, setResolvedMode]);

  return { themeId, mode, resolvedMode, setThemeId, setMode };
}
