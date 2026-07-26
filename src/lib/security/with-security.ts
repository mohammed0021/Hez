import { NextResponse } from 'next/server';
import { audit, type AuditEventType } from './audit-log';
import { captureApiError } from './error-monitoring';
import { checkRateLimit, getRateLimitKey, rateLimitHeaders, API_RATE_LIMITS } from './rate-limit';
import { validateCsrfToken, verifySession } from './csrf';
import { sanitizeHtml } from './sanitize';
import { getAllSecurityHeaders } from './headers';
import { validateEnv } from './env-validator';

export interface SecurityOptions {
  requireAuth?: boolean;
  requireCsrf?: boolean;
  rateLimit?: boolean;
  rateLimitPath?: string;
  auditEvent?: AuditEventType;
  sanitizeBody?: boolean;
}

const DEFAULT_OPTIONS: SecurityOptions = {
  requireAuth: true,
  requireCsrf: true,
  rateLimit: true,
  sanitizeBody: false,
};

type RouteHandler = (request: Request, ...rest: unknown[]) => Promise<Response>;

export function withSecurity(handler: RouteHandler, options: SecurityOptions = {}): RouteHandler {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (request: Request, ...rest: unknown[]): Promise<Response> => {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;

      if (opts.rateLimit) {
        const rlPath = options.rateLimitPath || path;
        const rlConfig = API_RATE_LIMITS[rlPath] || API_RATE_LIMITS.default;
        const rlKey = getRateLimitKey(request, rlPath);
        const rlResult = checkRateLimit(rlKey, rlConfig);
        if (!rlResult.allowed) {
          audit('security.rate_limited', { path, method });
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
              status: 429,
              headers: {
                ...rateLimitHeaders(rlResult.remaining, rlResult.resetAt),
                'Retry-After': String(Math.ceil((rlResult.resetAt - Date.now()) / 1000)),
              },
            },
          );
        }
      }

      if (opts.requireCsrf) {
        const csrfResult = await validateCsrfToken(request);
        if (!csrfResult.valid) {
          audit('security.csrf_blocked', { path, method, error: csrfResult.reason });
          return NextResponse.json(
            { error: csrfResult.reason || 'CSRF validation failed' },
            { status: 403 },
          );
        }
      }

      let userId: string | undefined;

      if (opts.requireAuth) {
        const session = await verifySession();
        if (!session.userId) {
          audit('security.unauthorized', { path, method, error: session.error });
          return NextResponse.json(
            { error: session.error || 'Authentication required' },
            { status: 401 },
          );
        }
        userId = session.userId;
      }

      if (opts.sanitizeBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          const body = await request.clone().json();
          if (body && typeof body === 'object') {
            const sanitized = sanitizeRequestBody(body as Record<string, unknown>);
            const sanitizedBody = JSON.stringify(sanitized);
            const newRequest = new Request(request.url, {
              method: request.method,
              headers: request.headers,
              body: sanitizedBody,
            });
            return handler(newRequest, ...rest);
          }
        } catch {
          // Not JSON or parse error - continue with original request
        }
      }

      const response = await handler(request, ...rest);

      if (opts.auditEvent && userId) {
        audit(opts.auditEvent, { userId, path, method, status: response.status });
      }

      const securityHeaders = getAllSecurityHeaders();
      const responseHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(securityHeaders)) {
        if (!responseHeaders.has(key)) {
          responseHeaders.set(key, value);
        }
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      const url = new URL(request.url);
      captureApiError(error, { path: url.pathname, method: request.method });
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  };
}

function sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      if (key === 'endpoint' || key === 'p256dh' || key === 'auth') {
        result[key] = value;
      } else {
        result[key] = sanitizeHtml(value);
      }
    } else if (value !== null && typeof value === 'object') {
      result[key] = sanitizeRequestBody(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

let envValidated = false;

export function validateEnvOnStartup(): void {
  if (envValidated) return;
  envValidated = true;
  const result = validateEnv();
  if (!result.valid) {
    console.error('[SECURITY] Environment variable validation failed:');
    for (const err of result.errors) {
      console.error(`  - ${err.key}: ${err.message}`);
    }
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed in production');
    }
  }
  if (result.warnings.length > 0) {
    console.warn('[SECURITY] Environment variable warnings:');
    for (const warn of result.warnings) {
      console.warn(`  - ${warn.key}: ${warn.message}`);
    }
  }
}
