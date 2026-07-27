'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { defaultLocale } from '@/i18n/locales';

export function LocaleInit({ cookieLocale }: { cookieLocale: string }) {
  const { locale, setLocale } = useLocaleStore();

  useEffect(() => {
    const valid = cookieLocale || defaultLocale;
    if (locale !== valid) {
      setLocale(valid as typeof locale);
    }
  }, [cookieLocale, locale, setLocale]);

  return null;
}
