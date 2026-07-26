const HTML_TAG_RE = /<[^>]*>/g;
const EVENT_HANDLER_RE = /\bon\w+\s*=\s*['"]?[^'"]*['"]?/gi;
const JS_PROTOCOL_RE = /javascript\s*:/gi;
const DATA_PATTERN_RE = /data\s*:\s*text\/html/gi;
const DOCUMENT_WRITE_RE = /document\.write\s*\(/gi;

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(HTML_TAG_RE, '')
    .replace(EVENT_HANDLER_RE, '')
    .replace(JS_PROTOCOL_RE, '')
    .replace(DATA_PATTERN_RE, '')
    .replace(DOCUMENT_WRITE_RE, '');
}

export function sanitizeAttribute(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/['"<>]/g, '')
    .replace(EVENT_HANDLER_RE, '')
    .replace(JS_PROTOCOL_RE, '');
}

export function sanitizeThemeId(input: string): string {
  if (typeof input !== 'string') return 'hez-green';
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!cleaned) return 'hez-green';
  return cleaned.slice(0, 50);
}

export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') return '';
  const cleaned = input.trim();
  if (/^(https?:\/\/|\/)/i.test(cleaned) && !/javascript:/i.test(cleaned)) {
    return cleaned.slice(0, 2048);
  }
  return '';
}

export function sanitizeEmail(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, '');
}

export function sanitizeDisplayName(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>&'"\n\r]/g, '')
    .trim()
    .slice(0, 100);
}

export function sanitizePushSubscription(input: unknown): Record<string, unknown> | null {
  if (typeof input !== 'object' || input === null) return null;
  const obj = input as Record<string, unknown>;
  if (typeof obj.endpoint !== 'string' || !obj.endpoint.startsWith('https://')) return null;
  if (typeof obj.keys !== 'object' || obj.keys === null) return null;
  const keys = obj.keys as Record<string, unknown>;
  if (typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') return null;
  if (keys.p256dh.length > 256 || keys.auth.length > 256) return null;
  return {
    endpoint: obj.endpoint.slice(0, 512),
    keys: { p256dh: keys.p256dh.slice(0, 256), auth: keys.auth.slice(0, 256) },
  };
}
