import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n/locales';
import en from '@/messages/en.json';
import ku from '@/messages/ku.json';
import ar from '@/messages/ar.json';

const messages: Record<string, Record<string, unknown>> = { en, ku, ar };

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = (locales as readonly string[]).includes(localeCookie ?? '')
    ? localeCookie!
    : defaultLocale;

  return {
    locale,
    messages: messages[locale] ?? messages[defaultLocale]!,
  };
});
