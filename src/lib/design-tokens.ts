export const colors = {
  primary: {
    50: 'oklch(0.95 0.05 160)',
    100: 'oklch(0.90 0.10 160)',
    200: 'oklch(0.80 0.15 160)',
    300: 'oklch(0.70 0.20 160)',
    400: 'oklch(0.60 0.25 160)',
    500: 'oklch(0.55 0.25 160)',
    600: 'oklch(0.45 0.20 160)',
    700: 'oklch(0.35 0.15 160)',
    800: 'oklch(0.25 0.10 160)',
    900: 'oklch(0.15 0.05 160)',
  },
  neutral: {
    50: 'oklch(0.985 0 0)',
    100: 'oklch(0.97 0 0)',
    200: 'oklch(0.92 0 0)',
    300: 'oklch(0.87 0 0)',
    400: 'oklch(0.70 0 0)',
    500: 'oklch(0.55 0 0)',
    600: 'oklch(0.44 0 0)',
    700: 'oklch(0.37 0 0)',
    800: 'oklch(0.27 0 0)',
    900: 'oklch(0.145 0 0)',
    950: 'oklch(0.10 0 0)',
  },
  success: 'oklch(0.65 0.25 150)',
  warning: 'oklch(0.75 0.20 80)',
  error: 'oklch(0.60 0.25 25)',
  info: 'oklch(0.60 0.20 240)',
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans, system-ui, -apple-system, sans-serif)',
    mono: 'var(--font-geist-mono, monospace)',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const radii = {
  none: '0',
  xs: '0.25rem',
  sm: 'calc(0.75rem * 0.6)',
  md: 'calc(0.75rem * 0.8)',
  lg: '0.75rem',
  xl: 'calc(0.75rem * 1.4)',
  '2xl': 'calc(0.75rem * 1.8)',
  '3xl': 'calc(0.75rem * 2.2)',
  '4xl': 'calc(0.75rem * 2.6)',
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 15px hsl(var(--theme-primary) / 0.3)',
  'glow-lg': '0 0 30px hsl(var(--theme-primary) / 0.2)',
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;
