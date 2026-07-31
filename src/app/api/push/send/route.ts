import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getAllSubscriptions } from '@/lib/push-store';
import { withSecurity } from '@/lib/security/with-security';
import { getEnvOrThrow } from '@/lib/security/env-validator';
import { sanitizeHtml } from '@/lib/security/sanitize';

async function sendHandler(request: Request) {
  const publicKey = getEnvOrThrow('VAPID_PUBLIC_KEY');
  const privateKey = getEnvOrThrow('VAPID_PRIVATE_KEY');
  const subject = process.env.VAPID_SUBJECT || 'mailto:hez@example.com';

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const { title, body, icon, tag, data } = await request.json();
  const subscriptions = await getAllSubscriptions();

  if (subscriptions.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const safeTitle = title ? sanitizeHtml(String(title)).slice(0, 100) : 'Hêz';
  const safeBody = body ? sanitizeHtml(String(body)).slice(0, 255) : undefined;

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        sub as unknown as webpush.PushSubscription,
        JSON.stringify({
          title: safeTitle,
          body: safeBody,
          icon: icon || '/icons/icon-192x192.png',
          tag: tag ? sanitizeHtml(String(tag)).slice(0, 50) : undefined,
          data,
        }),
      ),
    ),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return NextResponse.json({ ok: true, sent, total: subscriptions.length });
}

export const POST = withSecurity(sendHandler, {
  requireAuth: true,
  requireCsrf: true,
  auditEvent: 'api.push.send',
  sanitizeBody: true,
});

export const dynamic = 'force-dynamic';
