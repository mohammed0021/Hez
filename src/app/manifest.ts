import type { MetadataRoute } from 'next';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n/locales';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = (locales as readonly string[]).includes(localeCookie ?? '')
    ? (localeCookie as string)
    : defaultLocale;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return {
    name: 'Hêz — Premium Fitness Tracking',
    short_name: 'Hêz',
    description:
      'Premium fitness tracking experience. Track workouts, monitor progress, and achieve your fitness goals.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#10b981',
    categories: ['fitness', 'health', 'lifestyle', 'sports'],
    lang: locale,
    dir,
    prefer_related_applications: false,
    scope: '/',
    id: '/',
    shortcuts: [
      {
        name: 'New Workout',
        short_name: 'New',
        description: 'Start a new workout session',
        url: '/workouts/new',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Progress',
        short_name: 'Stats',
        description: 'View your fitness progress',
        url: '/progress',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Profile',
        short_name: 'Me',
        description: 'View your profile and settings',
        url: '/profile',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      {
        src: '/screenshots/dashboard.webp',
        sizes: '1170x2532',
        type: 'image/webp',
        form_factor: 'narrow',
        label: 'Dashboard overview with workout, nutrition, and progress widgets',
      },
      {
        src: '/screenshots/workout.webp',
        sizes: '1170x2532',
        type: 'image/webp',
        form_factor: 'narrow',
        label: 'Active workout tracking with real-time set logging',
      },
      {
        src: '/screenshots/progress.webp',
        sizes: '1170x2532',
        type: 'image/webp',
        form_factor: 'narrow',
        label: 'Progress charts for weight, measurements, and strength trends',
      },
    ],
    icons: [
      { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
