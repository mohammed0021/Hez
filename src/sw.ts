// @ts-nocheck
import { defaultCache } from '@serwist/next/worker';
import { installSerwist } from '@serwist/sw';

installSerwist({
  precacheEntries: self.__SW_MANIFEST || self.__WB_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workouts') {
    event.waitUntil(syncWorkouts());
  }
});

async function syncWorkouts() {
  const cache = await caches.open('workout-queue');
  const requests = await cache.keys();
  await Promise.allSettled(
    requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.delete(request);
      } catch {
        // Still offline
      }
    }),
  );
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline') || caches.match('/')),
    );
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const {
      title = 'Hêz',
      body,
      icon = '/icons/icon-192x192.png',
      badge = '/icons/icon-192x192.png',
      tag,
      data: notificationData,
      requireInteraction = true,
      actions = [],
      vibrate = [200, 100, 200],
    } = data;

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon,
        badge,
        tag,
        data: notificationData,
        requireInteraction,
        actions,
        vibrate,
      }),
    );
  } catch {
    // Invalid push data
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const focusedClient = clientList.find((c) => c.focused);
      if (focusedClient) return;
      const matchingClient = clientList.find((c) => c.url.includes(url));
      if (matchingClient) {
        return matchingClient.focus();
      }
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(url);
    }),
  );
});
