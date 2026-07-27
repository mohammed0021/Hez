export const locales = ['en', 'ku', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ku: 'Kurdî',
  ar: 'العربية',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ku: 'ltr',
  ar: 'rtl',
};

export const RTL_LOCALES: Locale[] = ['ar'];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return localeDirections[locale as Locale] || 'ltr';
}
