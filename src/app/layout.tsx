import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { PwaProvider } from '@/components/pwa-provider';
import './globals.css';
import enMessages from '@/locales/en.json';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const APP_NAME = 'Hêz';
const APP_DESCRIPTION = 'Premium fitness tracking experience';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
    startupImage: [
      '/splash/apple-splash-2048x2732.png',
    ],
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
      { url: '/favicon.ico', sizes: 'any' },
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
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/icons/apple-icon-180x180.png' },
      { rel: 'mask-icon', url: '/icons/icon.svg', color: '#10b981' },
    ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = JSON.parse(localStorage.getItem('hez-theme') || '{}');
                var mode = theme.mode || 'system';
                var themeId = theme.themeId || 'hez-green';
                document.documentElement.setAttribute('data-theme', themeId);
                if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <Providers locale="en" messages={enMessages}>
          <PwaProvider>
            {children}
          </PwaProvider>
        </Providers>
      </body>
    </html>
  );
}
