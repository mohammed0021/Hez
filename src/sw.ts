import { defaultCache } from '@serwist/next/worker';
import { installSerwist } from '@serwist/sw';

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries:
    (self as unknown as { __SW_MANIFEST: unknown }).__SW_MANIFEST ||
    (self as unknown as { __WB_MANIFEST: unknown }).__WB_MANIFEST,
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
      fetch(event.request).catch(async () => {
        const offline = await caches.match('/offline');
        return offline || (await caches.match('/'))!;
      }),
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
        actions: actions as unknown as undefined,
        vibrate: vibrate as unknown as undefined,
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
      if (focusedClient) return focusedClient.focus();
      const matchingClient = clientList.find((c) => {
        try {
          const target = new URL(url, self.location.origin).pathname;
          return new URL(c.url).pathname === target;
        } catch {
          return false;
        }
      });
      if (matchingClient) return matchingClient.focus();
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(url);
    }),
  );
});
