import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { Providers } from '@/components/providers';
import { LocaleInit } from '@/components/locale-init';
import { PwaProvider } from '@/components/pwa-provider';
import { locales, defaultLocale, getDirection } from '@/i18n/locales';
import enMessages from '@/messages/en.json';
import kuMessages from '@/messages/ku.json';
import arMessages from '@/messages/ar.json';
import './globals.css';

const messageMap: Record<string, Record<string, unknown>> = {
  en: enMessages,
  ku: kuMessages,
  ar: arMessages,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const APP_NAME = 'Hêz';
const APP_DESCRIPTION =
  'Premium fitness tracking experience. Track workouts, log nutrition, monitor progress, and achieve your fitness goals with Hêz — the all-in-one fitness companion.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hez.fit';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: APP_NAME,
    title: `${APP_NAME} — Premium Fitness Tracking`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — Premium Fitness Tracking`,
    description: APP_DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
    startupImage: ['/splash/apple-splash-2048x2732.png'],
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  applicationName: APP_NAME,
  generator: 'Next.js',
  keywords: ['fitness', 'workout', 'training', 'health', 'exercise'],
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/icons/apple-icon-167x167.png', sizes: '167x167' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [{ rel: 'apple-touch-icon-precomposed', url: '/icons/apple-icon-180x180.png' }],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#10b981',
    'msapplication-TileImage': '/icons/icon-144x144.png',
    'msapplication-config': 'none',
    'apple-mobile-web-app-title': APP_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = locales.includes(localeCookie as (typeof locales)[number])
    ? (localeCookie as (typeof locales)[number])
    : defaultLocale;
  const dir = getDirection(locale);
  const messages = messageMap[locale] ?? messageMap[defaultLocale]!;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_NAME,
              url: APP_URL,
              description: APP_DESCRIPTION,
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'Hêz Fitness',
              },
            }),
          }}
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                function s(v) { return typeof v === 'string' ? v.replace(/[^a-zA-Z0-9_-]/g, '') : 'hez-green'; }
                function m(v) { return v === 'dark' || v === 'light' || v === 'system' ? v : 'system'; }
                function l(v) { return v === 'en' || v === 'ku' || v === 'ar' ? v : 'en'; }
                var theme = JSON.parse(localStorage.getItem('hez-theme') || '{}');
                var localeData = JSON.parse(localStorage.getItem('hez-locale') || '{}');
                var mode = m(theme.mode);
                var themeId = s(theme.themeId) || 'hez-green';
                var locale = l(localeData.locale);
                document.documentElement.setAttribute('data-theme', themeId);
                document.documentElement.setAttribute('lang', locale);
                document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
                if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <Providers messages={messages}>
          <LocaleInit cookieLocale={locale} />
          <PwaProvider>{children}</PwaProvider>
        </Providers>
      </body>
    </html>
  );
}
