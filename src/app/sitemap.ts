import type { MetadataRoute } from 'next';

const BASE_URL = 'https://hez.fit';
const LAST_MODIFIED = new Date();

const staticRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/dashboard',
  '/workouts',
  '/workouts/new',
  '/workouts/templates',
  '/workouts/active',
  '/exercises',
  '/progress',
  '/progress/weight',
  '/progress/measurements',
  '/progress/strength',
  '/progress/analytics',
  '/progress/bmi',
  '/progress/records',
  '/supplements',
  '/supplements/manage',
  '/supplements/history',
  '/calendar',
  '/gamification',
  '/profile',
  '/settings',
  '/settings/notifications',
  '/programs',
  '/design-system',
  '/offline',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1.0 : route.startsWith('/auth') ? 0.3 : 0.8,
  }));
}
