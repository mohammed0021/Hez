export interface SecurityHeaders {
  [key: string]: string;
}

export function getCspDirectives(): Record<string, string[]> {
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
    : '*.supabase.co';

  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", `https://${supabaseHost}`, `wss://${supabaseHost}`],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
  };
}

export function buildCsp(): string {
  const directives = getCspDirectives();
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

export const SECURITY_HEADERS: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), clipboard-read=(), clipboard-write=(self)',
};

export const CSP_HEADER = { 'Content-Security-Policy': buildCsp() };

export function getAllSecurityHeaders(): SecurityHeaders {
  return {
    ...SECURITY_HEADERS,
    ...CSP_HEADER,
  };
}
