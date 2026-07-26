import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hêz — Premium Fitness Tracking',
    short_name: 'Hêz',
    description: 'Premium fitness tracking experience. Track workouts, monitor progress, and achieve your fitness goals.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#10b981',
    categories: ['fitness', 'health', 'lifestyle', 'sports'],
    lang: 'en',
    dir: 'ltr',
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
