type AuthEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'REGISTER';

type SecurityEventType =
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_TOKEN'
  | 'SUSPICIOUS_ACTIVITY';

interface AuditMeta {
  email?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export function logAuthEvent(event: AuthEventType, meta: AuditMeta = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    category: 'auth',
    event,
    ...meta,
  };
  console.log('[AUTH]', JSON.stringify(entry));
}

export function logSecurityEvent(event: SecurityEventType, meta: AuditMeta = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    category: 'security',
    event,
    ...meta,
  };
  console.warn('[SECURITY]', JSON.stringify(entry));
}
