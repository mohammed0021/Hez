'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/i18n/locales';
import { defaultLocale } from '@/i18n/locales';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LOCALE_COOKIE = 'NEXT_LOCALE';

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => {
        set({ locale });
        setCookie(LOCALE_COOKIE, locale);
        if (typeof window !== 'undefined') {
          const dir = locale === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.setAttribute('dir', dir);
          document.documentElement.setAttribute('lang', locale);
        }
      },
    }),
    {
      name: 'hez-locale',
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setCookie(LOCALE_COOKIE, state.locale);
        }
      },
    },
  ),
);
