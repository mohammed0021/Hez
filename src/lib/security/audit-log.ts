export type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.register'
  | 'auth.password_reset'
  | 'auth.failed_login'
  | 'api.push.subscribe'
  | 'api.push.unsubscribe'
  | 'api.push.send'
  | 'api.notification'
  | 'data.export'
  | 'account.delete'
  | 'profile.update'
  | 'settings.change'
  | 'security.csrf_blocked'
  | 'security.rate_limited'
  | 'security.unauthorized'
  | 'error.api'
  | 'error.client';

export interface AuditEntry {
  timestamp: string;
  event: AuditEventType;
  userId?: string;
  ip?: string;
  path?: string;
  method?: string;
  status?: number;
  metadata?: Record<string, unknown>;
  error?: string;
}

const MAX_LOG_ENTRIES = 1000;
const auditBuffer: AuditEntry[] = [];

export function audit(
  event: AuditEventType,
  data: {
    userId?: string;
    ip?: string;
    path?: string;
    method?: string;
    status?: number;
    metadata?: Record<string, unknown>;
    error?: string;
  } = {},
): void {
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };

  auditBuffer.push(entry);
  if (auditBuffer.length > MAX_LOG_ENTRIES) {
    auditBuffer.shift();
  }

  if (process.env.NODE_ENV === 'development') {
    const prefix = `[AUDIT:${entry.event}]`;
    const details = [entry.userId, entry.path, entry.status].filter(Boolean).join(' ');
    console.log(`${prefix} ${details}${entry.error ? ` - ${entry.error}` : ''}`);
  }
}

export function getAuditLog(filters?: {
  event?: AuditEventType;
  userId?: string;
  since?: Date;
}): AuditEntry[] {
  let entries = [...auditBuffer];
  if (filters?.event) entries = entries.filter((e) => e.event === filters.event);
  if (filters?.userId) entries = entries.filter((e) => e.userId === filters.userId);
  if (filters?.since) entries = entries.filter((e) => new Date(e.timestamp) >= filters.since!);
  return entries.reverse();
}

export function clearAuditLog(): void {
  auditBuffer.length = 0;
}
