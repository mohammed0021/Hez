# Hêz — Public Launch Checklist

## Pre-Launch (T-7 days)

### Infrastructure

- [ ] Vercel Pro plan active with team access
- [ ] Supabase Pro plan active with PITR enabled
- [ ] Custom domain `hez.fit` configured (DNS propagated)
- [ ] SSL certificate valid (auto via Vercel)
- [ ] CDN caching configured (Vercel Edge Network)
- [ ] Rate limiting tested on API routes

### Environment & Secrets

- [x] `.env.example` documents all required variables
- [ ] Vercel environment variables set for production
- [ ] `VAPID_PRIVATE_KEY` stored as secret (not in code)
- [ ] `SENTRY_AUTH_TOKEN` stored as secret
- [ ] Supabase anon key scoped to public/anonymous access only
- [ ] No secrets committed to git history

### Database

- [ ] All 5 migrations applied to production Supabase
- [ ] RLS verified on ALL user-data tables
- [ ] Indexes in place for query performance
- [ ] PITR enabled (7-day granularity)
- [ ] Daily automated backups confirmed
- [ ] Storage buckets (`progress-photos`, `avatars`) created with RLS

### Authentication

- [ ] Email confirmation working
- [ ] Password reset flow tested
- [ ] Session management configured (7-day expiry)
- [ ] OAuth providers tested (if enabled)
- [ ] Rate limiting on auth endpoints

### SEO & Social

- [x] Sitemap: `/sitemap.xml` (36 static routes)
- [x] Robots.txt: `/robots.txt` (blocks AI crawlers)
- [x] Open Graph image: 1200×630px
- [x] Twitter card: `summary_large_image`
- [x] Canonical URLs on all pages
- [x] JSON-LD structured data (WebApplication schema)
- [ ] Meta descriptions on all pages
- [ ] Google Search Console verified
- [ ] Submit sitemap to Google Search Console

### PWA

- [x] Manifest valid: `/manifest.webmanifest`
- [x] Service worker registered: `/sw.js`
- [x] Offline page: `/offline`
- [x] Apple touch icons (152, 167, 180px)
- [x] Splash screens for all iOS devices
- [x] Maskable icons (192, 384, 512px)
- [x] Shortcuts: New Workout, Progress, Profile
- [x] Background sync for offline workouts
- [x] Push notifications configured
- [ ] Chrome DevTools → Application → Manifest passes validation
- [ ] Test install on: Chrome, Safari, Samsung Internet
- [ ] Test offline experience: add to home screen → airplane mode → navigate

### Security

- [x] CSP headers configured
- [x] HSTS enabled (max-age=63072000; includeSubDomains; preload)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [ ] Submit to HSTS preload list: `https://hstspreload.com`
- [ ] Rate limiting on all API routes
- [ ] Input sanitization on all user inputs
- [ ] File upload validation (size, type, scan)
- [ ] Dependencies audited: `npm audit`

### Performance

- [x] Lighthouse desktop ≥90
- [x] Lighthouse mobile ≥80
- [x] Bundle analyzer run, optimized imports
- [x] Image optimization (AVIF, WebP)
- [x] Route-level code splitting
- [x] Virtualized lists (exercises, foods)
- [ ] JS bundles < 200KB gzip initial load
- [ ] Core Web Vitals within green thresholds

### Monitoring

- [ ] Sentry DSN configured
- [ ] PostHog API key configured
- [ ] Custom alert rules in Sentry
- [ ] Uptime monitoring (e.g., Better Uptime, Pingdom)
- [ ] Logs retention configured
- [ ] Error response template configured

### Testing

- [x] Build passes: `npm run build` (0 errors)
- [x] TypeScript: `npm run typecheck` (0 errors)
- [x] Unit tests: `npm test` (58/58 passing)
- [ ] E2E tests: `npm run test:e2e` (all passing)
- [ ] Accessibility: `npm run test:a11y` (0 violations)
- [ ] Lighthouse accessibility ≥95
- [ ] Test on: Chrome, Firefox, Safari, Edge
- [ ] Test on: iOS Safari, Android Chrome
- [ ] Test slow network (3G throttling)
- [ ] Test error states (invalid data, network failure)

## Launch Day (T-0)

### Final Checks

- [ ] Deploy latest `main` to production
- [ ] Smoke test all critical flows:
  - [ ] Registration → Email verification → Login
  - [ ] Start workout → Log set → Complete workout
  - [ ] Log weight → View progress chart
  - [ ] Log meal → View nutrition breakdown
  - [ ] Add supplement → Set reminder → Receive notification
  - [ ] Install PWA → Offline navigation
  - [ ] Dark/Light theme toggle persists
- [ ] Google Analytics / PostHog captures events correctly
- [ ] Sentry reports no unexpected errors
- [ ] SSL certificate valid (not expired)
- [ ] DNS propagated globally
- [ ] Check all third-party integrations:
  - [ ] Supabase connection
  - [ ] VAPID push notifications
  - [ ] PostHog analytics
  - [ ] Sentry error reporting

### Go Live

- [ ] Enable public access (remove any IP restrictions)
- [ ] Post on Product Hunt / social media
- [ ] Monitor Sentry for first 2 hours continuously
- [ ] Monitor server response times
- [ ] Watch for auth bottlenecks

## Post-Launch (T+1 to T+30 days)

### Week 1

- [ ] Monitor error rates daily
- [ ] Check database performance (slow queries)
- [ ] Review analytics for user behavior patterns
- [ ] Gather feedback from early users
- [ ] Fix critical bugs within 24 hours

### Week 2-4

- [ ] Analyze retention metrics
- [ ] A/B test onboarding flow
- [ ] Review PWA install metrics
- [ ] Optimize based on Core Web Vitals
- [ ] Plan v1.1 features based on feedback

## Quick Reference

```bash
# Build & Verify
npm run build              # Production build
npm run typecheck          # TypeScript check
npm test                   # Unit tests
npm run test:e2e           # E2E tests
npm run test:a11y          # Accessibility tests

# Deploy
git push origin main       # Auto-deploys to Vercel
npx vercel --prod          # Manual deploy

# Database
supabase migration up      # Apply pending migrations
supabase db dump -f backup.sql  # Manual backup

# Monitor
npm audit                  # Security audit
npx next lint              # Lint check
```
