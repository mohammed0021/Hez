import type { NextConfig } from 'next';
import withSerwist from '@serwist/next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withPWA = withSerwist({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

const withIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBA = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : '*.supabase.co';
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
  ? new URL(process.env.NEXT_PUBLIC_POSTHOG_HOST).host
  : 'app.posthog.com';
const sentryHost = process.env.SENTRY_DSN ? new URL(process.env.SENTRY_DSN).host : '*.sentry.io';

const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${posthogHost}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://${posthogHost} https://placehold.co`,
  `font-src 'self' data:`,
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://${posthogHost} https://${sentryHost}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `manifest-src 'self'`,
  `media-src 'self'`,
  `object-src 'none'`,
];

const nextConfig: NextConfig = withBA(
  withPWA(
    withIntl({
      reactStrictMode: true,
      images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [320, 420, 640, 768, 1024, 1280],
        imageSizes: [48, 64, 96, 128, 256],
        minimumCacheTTL: 31536000,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
          },
          {
            protocol: 'https',
            hostname: '**.supabase.co',
          },
        ],
      },
      experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
      },
      headers: async () => [
        {
          source: '/icons/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/splash/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/screenshots/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/sw.js',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
            { key: 'Service-Worker-Allowed', value: '/' },
          ],
        },
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'X-DNS-Prefetch-Control', value: 'off' },
            { key: 'X-Download-Options', value: 'noopen' },
            { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'Permissions-Policy',
              value:
                'camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), clipboard-read=(), clipboard-write=(self)',
            },
            { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
          ],
        },
      ],
    }),
  ),
);

export default nextConfig;
