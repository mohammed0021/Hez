# Hêz — Premium Fitness Tracking

Track workouts, log nutrition, monitor progress, and achieve your fitness goals.

## Tech Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 16 (webpack)           |
| Language  | TypeScript (strict)            |
| Styling   | Tailwind CSS v4 + shadcn/ui v4 |
| State     | Zustand + TanStack Query       |
| Database  | Supabase (PostgreSQL)          |
| Auth      | Supabase SSR                   |
| PWA       | Serwist (service worker)       |
| Charts    | Recharts                       |
| Animation | Framer Motion                  |
| Forms     | React Hook Form + Zod          |
| Analytics | PostHog                        |
| Errors    | Sentry                         |
| Tests     | Vitest + Playwright + axe-core |

## Quick Start

```bash
# Install
npm ci

# Copy environment
cp .env.example .env.local
# → Fill in Supabase credentials and VAPID keys

# Develop
npm run dev

# Build
npm run build

# Test
npm test                    # Unit tests
npm run test:e2e            # E2E tests
npm run test:a11y           # Accessibility
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Authenticated routes
│   ├── auth/               # Login, register, password reset
│   └── api/                # API routes (push, notifications)
├── components/             # Shared UI components
│   ├── ui/                 # Base components (button, card, etc.)
│   ├── exercises/          # Exercise-related components
│   └── gamification/       # XP bar, achievements, challenges
├── lib/                    # Utilities, types, helpers
│   ├── security/           # Rate limiting, CSP, CSRF, sanitize
│   └── gamification-types  # Achievements, challenges, XP math
├── stores/                 # Zustand stores
└── hooks/                  # Custom React hooks

public/
├── icons/                  # PWA icons (72–512px)
├── splash/                 # iOS splash screens
└── screenshots/            # App store screenshots

supabase/
└── migrations/             # Database schema (5 migrations)
```

## Key Features

- **Workout Tracking** — Real-time set logging, rest timer, templates
- **Exercise Library** — 1,469 exercises with video/media references
- **Progress Tracking** — Weight, measurements, strength (1RM), photos
- **Nutrition Logging** — Meals, macros, water tracking
- **Supplement Management** — Reminders, logging, history
- **Calendar & Planning** — Month/week/day views, recurring schedules, training cycles
- **Gamification** — XP, levels, 25 achievements, 17 challenges, PR celebrations
- **PWA** — Offline support, push notifications, installable
- **8 Themes** — Dark/light/system with color variants
- **Security** — Rate limiting, CSP, HSTS, CSRF protection, input sanitization

## Scripts

| Script              | Purpose                 |
| ------------------- | ----------------------- |
| `npm run dev`       | Development server      |
| `npm run build`     | Production build        |
| `npm run start`     | Start production server |
| `npm run lint`      | ESLint check            |
| `npm run typecheck` | TypeScript check        |
| `npm test`          | Run vitest              |
| `npm run test:e2e`  | Playwright E2E tests    |
| `npm run test:a11y` | Accessibility tests     |
| `npm run coverage`  | Test coverage report    |
| `npm run format`    | Prettier formatting     |

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — Web Push notifications
- `NEXT_PUBLIC_POSTHOG_KEY` — Product analytics
- `SENTRY_DSN` — Error monitoring

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

```bash
# Deploy to Vercel
vercel --prod
```

## Database

See [SUPABASE.md](./SUPABASE.md) for database configuration and backup strategy.

5 migrations manage the full schema — run with `supabase migration up`.

## Testing

```bash
npm test                    # 58 unit/integration/component tests
npx playwright test         # E2E tests (auth, offline, PWA, a11y)
npx playwright test e2e/a11y.spec.ts  # axe-core accessibility
```

## License

Private — All rights reserved.
