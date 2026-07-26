import { NextResponse } from 'next/server';
import { addSubscription, removeSubscription } from '@/lib/push-store';
import { withSecurity } from '@/lib/security/with-security';
import { sanitizePushSubscription } from '@/lib/security/sanitize';

async function subscribeHandler(request: Request) {
  const body = await request.json();
  const sanitized = sanitizePushSubscription(body);
  if (!sanitized) {
    return NextResponse.json({ error: 'Invalid subscription format' }, { status: 400 });
  }
  addSubscription(sanitized);
  return NextResponse.json({ ok: true });
}

async function unsubscribeHandler(request: Request) {
  const body = await request.json().catch(() => null);
  if (body) {
    const sanitized = sanitizePushSubscription(body);
    if (sanitized) removeSubscription(sanitized);
  }
  return NextResponse.json({ ok: true });
}

export const POST = withSecurity(subscribeHandler, {
  requireAuth: false,
  requireCsrf: false,
  auditEvent: 'api.push.subscribe',
  sanitizeBody: false,
});

export const DELETE = withSecurity(unsubscribeHandler, {
  requireAuth: false,
  requireCsrf: false,
  auditEvent: 'api.push.unsubscribe',
  sanitizeBody: false,
});
