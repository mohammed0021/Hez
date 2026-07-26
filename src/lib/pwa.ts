'use client';

import { useEffect, useCallback, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listeners: Array<(prompt: BeforeInstallPromptEvent | null) => void> = [];

export function listenForInstallPrompt() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn(deferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn(null));
  });
}

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent;
    const iOS = /iphone|ipad|ipod/i.test(ua);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = iOS && 'standalone' in window.navigator && (window.navigator as unknown as { standalone?: boolean }).standalone;

    setIsIOS(iOS);
    setIsInstalled(standalone || !!iosStandalone);

    const handler = (p: BeforeInstallPromptEvent | null) => setPrompt(p);
    listeners.push(handler);

    if (deferredPrompt) {
      setPrompt(deferredPrompt);
    }

    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const install = useCallback(async () => {
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      deferredPrompt = null;
      setPrompt(null);
      setIsInstalled(true);
    }
  }, [prompt]);

  return {
    isInstallable: !!prompt,
    isInstalled,
    isIOS,
    isStandalone: isInstalled,
    install,
    showIOSInstructions: isIOS && !isInstalled,
  };
}

export function useServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      setRegistration(reg);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  const update = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  return { updateAvailable, update, registration };
}

export function registerBackgroundSync(tag: string) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((reg) => {
    if ('sync' in reg) {
      (reg as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
    }
  });
}
