export interface ErrorEvent {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  componentStack?: string;
  context?: Record<string, unknown>;
  userId?: string;
  path?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const MAX_ERRORS = 200;
const errorBuffer: ErrorEvent[] = [];

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function captureError(
  error: Error | string,
  context?: {
    userId?: string;
    path?: string;
    severity?: ErrorEvent['severity'];
    metadata?: Record<string, unknown>;
  },
): ErrorEvent {
  const message = typeof error === 'string' ? error : error.message;
  const event: ErrorEvent = {
    id: generateErrorId(),
    timestamp: new Date().toISOString(),
    message,
    stack: typeof error === 'object' ? error.stack : undefined,
    context: context?.metadata,
    userId: context?.userId,
    path: context?.path,
    severity: context?.severity || 'medium',
  };

  errorBuffer.push(event);
  if (errorBuffer.length > MAX_ERRORS) errorBuffer.shift();

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR:${event.severity}] ${event.message}`, event.stack || '');
  }

  return event;
}

export function captureApiError(
  error: unknown,
  context?: {
    userId?: string;
    path?: string;
    method?: string;
  },
): ErrorEvent {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const event: ErrorEvent = {
    id: generateErrorId(),
    timestamp: new Date().toISOString(),
    message: `[API] ${message}`,
    stack,
    context: { ...context, method: context?.method },
    userId: context?.userId,
    path: context?.path,
    severity: 'high',
  };

  errorBuffer.push(event);
  if (errorBuffer.length > MAX_ERRORS) errorBuffer.shift();

  return event;
}

export function getRecentErrors(minSeverity: ErrorEvent['severity'] = 'low'): ErrorEvent[] {
  const severityOrder: Record<ErrorEvent['severity'], number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };
  return errorBuffer
    .filter((e) => severityOrder[e.severity] >= severityOrder[minSeverity])
    .reverse()
    .slice(0, 50);
}

export function clearErrors(): void {
  errorBuffer.length = 0;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
