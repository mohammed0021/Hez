import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import enMessages from '@/messages/en.json';

type MessageNode = string | { [key: string]: MessageNode };

function lookup(namespace: string, key: string): string | undefined {
  let node: MessageNode | undefined = (enMessages as Record<string, MessageNode>)[namespace];
  for (const part of key.split('.')) {
    if (node && typeof node === 'object') {
      node = (node as Record<string, MessageNode>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === 'string' ? node : undefined;
}

function interpolate(message: string, params?: Record<string, unknown>): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (_match, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{${name}}`,
  );
}

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return {
    ...actual,
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
    useTranslations: (namespace: string) => {
      const t = (key: string, params?: Record<string, unknown>): string => {
        const message = lookup(namespace, key);
        if (message === undefined) return `${namespace}.${key}`;
        return interpolate(message, params);
      };
      (t as typeof t & { rich: unknown }).rich = t;
      return t as typeof t & { rich: typeof t };
    },
  };
});
