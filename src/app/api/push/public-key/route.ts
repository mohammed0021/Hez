import { NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/with-security';
import { getEnvOrThrow } from '@/lib/security/env-validator';

async function publicKeyHandler() {
  const publicKey = getEnvOrThrow('NEXT_PUBLIC_VAPID_PUBLIC_KEY');
  return NextResponse.json({ publicKey });
}

export const GET = withSecurity(publicKeyHandler, {
  requireAuth: false,
  requireCsrf: false,
  rateLimitPath: '/api/push/public-key',
});
