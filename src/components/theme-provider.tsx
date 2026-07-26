'use client';

import { useTheme } from '@/hooks/use-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useTheme();
  return <>{children}</>;
}
