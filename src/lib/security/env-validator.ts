export interface EnvValidationResult {
  valid: boolean;
  errors: { key: string; message: string }[];
  warnings: { key: string; message: string }[];
}

const REQUIRED_ENV_KEYS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;

const CONDITIONAL_ENV_KEYS: { key: string; dependsOn: string; label: string }[] = [
  {
    key: 'VAPID_PUBLIC_KEY',
    dependsOn: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
    label: 'VAPID public key (server)',
  },
  { key: 'VAPID_PRIVATE_KEY', dependsOn: 'VAPID_PUBLIC_KEY', label: 'VAPID private key' },
  { key: 'VAPID_SUBJECT', dependsOn: 'VAPID_PUBLIC_KEY', label: 'VAPID subject' },
];

const URL_PATTERNS: { key: string; pattern: RegExp }[] = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL', pattern: /^https:\/\/[a-zA-Z0-9.-]+\.supabase\.co$/ },
  { key: 'NEXT_PUBLIC_APP_URL', pattern: /^https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?$/ },
];

const KEY_PATTERNS: { key: string; pattern: RegExp }[] = [
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', pattern: /^ey[Jra]/ },
];

export function validateEnv(): EnvValidationResult {
  const errors: { key: string; message: string }[] = [];
  const warnings: { key: string; message: string }[] = [];

  for (const key of REQUIRED_ENV_KEYS) {
    if (!process.env[key]) {
      errors.push({ key, message: `${key} is required but not set` });
    }
  }

  for (const { key, pattern } of URL_PATTERNS) {
    const val = process.env[key];
    if (val && !pattern.test(val)) {
      warnings.push({ key, message: `${key} format may be invalid` });
    }
  }

  for (const { key, pattern } of KEY_PATTERNS) {
    const val = process.env[key];
    if (val && !pattern.test(val)) {
      warnings.push({ key, message: `${key} looks like it may be malformed` });
    }
  }

  const hasVapidPublic = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const hasVapidPrivate = !!process.env.VAPID_PRIVATE_KEY;

  if (hasVapidPublic && !hasVapidPrivate) {
    errors.push({
      key: 'VAPID_PRIVATE_KEY',
      message: 'VAPID_PUBLIC_KEY is set but VAPID_PRIVATE_KEY is missing',
    });
  }
  if (hasVapidPrivate && !hasVapidPublic) {
    errors.push({
      key: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
      message: 'VAPID_PRIVATE_KEY is set but NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing',
    });
  }

  for (const { key, dependsOn, label } of CONDITIONAL_ENV_KEYS) {
    if (process.env[key] && !process.env[dependsOn]) {
      warnings.push({ key, message: `${label} is set but its dependency ${dependsOn} is not` });
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && appUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    warnings.push({
      key: 'NEXT_PUBLIC_APP_URL',
      message: 'App URL is set to localhost in production',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getEnvOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Required environment variable ${key} is not set`);
  return val;
}
