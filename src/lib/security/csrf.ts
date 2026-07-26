const CSRF_TOKEN_HEADER = 'x-csrf-token';

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hostMatches(urlHost: string, requestHost: string): boolean {
  if (urlHost === requestHost) return true;
  const urlPort = urlHost.includes(':') ? urlHost.split(':')[1] : '';
  const reqPort = requestHost.includes(':') ? requestHost.split(':')[1] : '';
  if (urlPort === reqPort) return false;
  const urlHostname = urlHost.split(':')[0];
  const reqHostname = requestHost.split(':')[0];
  return urlHostname === reqHostname;
}

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;
  try {
    const originUrl = new URL(origin);
    if (!hostMatches(originUrl.host, host)) return false;
    if (originUrl.protocol !== 'https:' && originUrl.protocol !== 'http:') return false;
    return true;
  } catch {
    return false;
  }
}

export function validateReferer(request: Request): boolean {
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  if (!referer || !host) return false;
  try {
    const refererUrl = new URL(referer);
    if (!hostMatches(refererUrl.host, host)) return false;
    return true;
  } catch {
    return false;
  }
}

interface CsrfValidationResult {
  valid: boolean;
  reason?: string;
}

export async function validateCsrfToken(request: Request): Promise<CsrfValidationResult> {
  const originCheck = validateOrigin(request);
  const refererCheck = validateReferer(request);
  if (!originCheck && !refererCheck) {
    return { valid: false, reason: 'Invalid origin or referer' };
  }

  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const token = request.headers.get(CSRF_TOKEN_HEADER);
  if (!token) {
    return { valid: false, reason: 'Missing CSRF token' };
  }

  if (token.length !== 64 || /[^a-f0-9]/.test(token)) {
    return { valid: false, reason: 'Invalid CSRF token format' };
  }

  return { valid: true };
}

export async function verifySession(): Promise<{ userId: string | null; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return { userId: null, error: 'Unauthorized' };
    return { userId: user.id };
  } catch {
    return { userId: null, error: 'Authentication failed' };
  }
}

async function createServerSupabaseClient() {
  const { createServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );
}
