'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme-provider';
import { AnalyticsProvider } from './analytics-provider';
import { useState } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import enMessages from '@/messages/en.json';
import kuMessages from '@/messages/ku.json';
import arMessages from '@/messages/ar.json';

const allMessages = { en: enMessages, ku: kuMessages, ar: arMessages };

interface ProvidersProps {
  children: React.ReactNode;
  messages: Record<string, unknown>;
}

export function Providers({ children, messages: serverMessages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const locale = useLocaleStore((s) => s.locale);
  const messages = allMessages[locale] ?? serverMessages;

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        <ThemeProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
