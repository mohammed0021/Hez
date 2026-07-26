import type { SeverityLevel } from '@sentry/nextjs';

export async function captureError(error: Error, context?: Record<string, unknown>) {
  try {
    const { captureException } = await import('@sentry/nextjs');
    captureException(error, { extra: context });
  } catch {
    // Sentry not available
  }
}

export async function captureMessage(message: string, level: SeverityLevel = 'info') {
  try {
    const { captureMessage: cm } = await import('@sentry/nextjs');
    cm(message, level);
  } catch {
    // Sentry not available
  }
}

export async function setSentryUser(userId: string, email?: string) {
  try {
    const { setUser } = await import('@sentry/nextjs');
    setUser({ id: userId, email });
  } catch {
    // Sentry not available
  }
}
