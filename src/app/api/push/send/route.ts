import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getAllSubscriptions } from '@/lib/push-store';

export async function POST(request: Request) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:hez@example.com';

  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    const { title, body, icon, tag, data } = await request.json();
    const subscriptions = getAllSubscriptions();

    if (subscriptions.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub as unknown as webpush.PushSubscription, JSON.stringify({
          title: title || 'Hêz',
          body,
          icon: icon || '/icons/icon-192x192.png',
          tag,
          data,
        })),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    return NextResponse.json({ ok: true, sent, total: subscriptions.length });
  } catch {
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
