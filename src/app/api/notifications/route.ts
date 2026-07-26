import { NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/with-security';

async function notificationsHandler(request: Request) {
  const body = await request.json();
  const { type, title } = body;

  if (!type || !title) {
    return NextResponse.json({ error: 'Missing required fields: type, title' }, { status: 400 });
  }

  if (typeof type !== 'string' || typeof title !== 'string') {
    return NextResponse.json({ error: 'Invalid field types' }, { status: 400 });
  }

  if (type.length > 50 || title.length > 200) {
    return NextResponse.json({ error: 'Field too long' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export const POST = withSecurity(notificationsHandler, {
  requireAuth: true,
  requireCsrf: true,
  auditEvent: 'api.notification',
  sanitizeBody: true,
});
