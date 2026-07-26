# Deployment Guide

## Prerequisites

- Node.js 22+
- Vercel account (or alternative host)
- Supabase Pro account
- Custom domain (optional)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values. Required for build:

```bash
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key
NEXT_PUBLIC_VAPID_PUBLIC_KEY   # Web Push public key
VAPID_PRIVATE_KEY              # Web Push private key (server only)
```

## Vercel Deployment

### 1. Connect Repository

- Push to GitHub: `git push origin main`
- Import in Vercel: `https://vercel.com/new`
- Select `hez` repository

### 2. Configure Project

- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Root Directory:** `./` (default)

### 3. Environment Variables

Add ALL variables from `.env.example` in Vercel Dashboard:

- Project Settings > Environment Variables
- Add for Production, Preview, Development

### 4. Custom Domain

```bash
# In Vercel Dashboard → Project → Domains
# Add: hez.fit
# Update DNS: add CNAME record pointing to cname.vercel-dns.com
```

### 5. Deploy

```bash
# Production
git push origin main  # auto-deploys

# Preview (via Vercel CLI)
npx vercel
```

## Post-Deployment Verification

| Check           | Command/URL                                               |
| --------------- | --------------------------------------------------------- |
| Build status    | `https://vercel.com/[team]/hez/deployments`               |
| App loads       | `https://hez.fit`                                         |
| Auth works      | Register + login flow                                     |
| PWA installable | Chrome → ⋮ → Install Hêz                                  |
| Service Worker  | DevTools → Application → Service Workers                  |
| Manifest valid  | `https://hez.fit/manifest.webmanifest`                    |
| Robots.txt      | `https://hez.fit/robots.txt`                              |
| Sitemap         | `https://hez.fit/sitemap.xml`                             |
| Open Graph      | `https://opengraph.xyz/?url=https://hez.fit`              |
| Lighthouse      | DevTools → Lighthouse → Generate report                   |
| CSP headers     | `curl -I https://hez.fit \| grep content-security-policy` |

## Monitoring

### Sentry (Error Tracking)

- Dashboard: `https://sentry.io/organizations/[org]/projects/hez/`
- Alerts: Configure for >10 errors/minute
- Releases: Automatic via Vercel integration

### PostHog (Analytics)

- Dashboard: `https://app.posthog.com/project/[id]`
- Track: Page views, sign-ups, workouts started, features used

### Vercel Analytics

- Built-in: `https://vercel.com/[team]/hez/analytics`
- Real-time: Active users, page views, geographic data

## Rollback

```bash
# In Vercel Dashboard → Deployments
# Click ⋮ on previous deployment → Promote to Production

# Or via CLI
npx vercel rollback [deployment-url]
```

## Performance Budgets

| Metric                   | Target            |
| ------------------------ | ----------------- |
| Lighthouse Performance   | ≥90               |
| Lighthouse Accessibility | ≥95               |
| First Contentful Paint   | <1.5s             |
| Time to Interactive      | <3.5s             |
| Largest Contentful Paint | <2.5s             |
| Cumulative Layout Shift  | <0.1              |
| Bundle Size (gzip)       | <200KB JS initial |
