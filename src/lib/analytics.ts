import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY) return;
  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: false,
    loaded: (ph) => {
      ph.register({
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV,
      });
    },
  });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId, traits);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function trackPageView(url: string) {
  if (!POSTHOG_KEY) return;
  posthog.capture('$pageview', { $current_url: url });
}

export function startSessionRecording() {
  if (!POSTHOG_KEY) return;
  posthog.startSessionRecording();
}

export function resetAnalytics() {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}
