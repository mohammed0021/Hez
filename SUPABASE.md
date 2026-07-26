# Supabase Production Configuration

## Database

### Migrations (applied in order)

```bash
supabase migration up
```

| #   | File                     | Description                                                              |
| --- | ------------------------ | ------------------------------------------------------------------------ |
| 1   | `001_schema.sql`         | Core tables: profiles, workouts, exercises, nutrition, supplements, etc. |
| 2   | `002_indexes.sql`        | Performance indexes on user_id, dates, foreign keys                      |
| 3   | `003_rls.sql`            | Row Level Security policies for all tables                               |
| 4   | `004_seed_exercises.sql` | ~1,469 exercise library                                                  |
| 5   | `005_seed_programs.sql`  | Starter workout programs                                                 |

### Verify RLS is enabled

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma_migrations';
```

### Backup Strategy

#### Automated Daily Backups (Supabase Pro)

- Supabase Pro plan includes daily backups with 7-day retention
- Backups include: database, storage, auth data
- Enable Point-in-Time Recovery (PITR) for up to 7 days of 1-minute granularity

#### Manual Backup Commands

```bash
# Full database backup (recommended before major changes)
pg_dump --dbname="$SUPABASE_DB_URL" --format=custom -f ./backups/hez-$(date +%Y%m%d).dump

# Restore (if needed)
pg_restore --dbname="$SUPABASE_DB_URL" --clean ./backups/hez-20260726.dump

# Export specific table
psql "$SUPABASE_DB_URL" -c "\copy public.workouts TO './backups/workouts-$(date +%Y%m%d).csv' CSV HEADER"
```

#### Storage Backups

```bash
# Download all storage objects
supabase storage download --bucket progress-photos ./backups/progress-photos/
supabase storage download --bucket avatars ./backups/avatars/
```

### Production Checklist

- [x] RLS enabled on all user-data tables
- [x] `is_owner()` helper function in place
- [x] Public tables (exercises, achievements) have proper read-only policies
- [ ] Enable PITR in Supabase dashboard (Settings > Database > Point-in-Time Recovery)
- [ ] Set up database branching for staging/PR previews
- [ ] Configure Database Webhooks for analytics snapshots
- [ ] Add weekly `VACUUM ANALYZE` via pg_cron or Supabase dashboard

### Connection Pooling

Supabase provides built-in connection pooling via PgBouncer. Use the pooler connection string:

```
postgresql://postgres:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## Auth Settings (Supabase Dashboard)

- [ ] Confirm email confirmation is enabled
- [ ] Set up custom SMTP for branded emails
- [ ] Configure redirect URLs: `https://hez.fit/auth/callback`
- [ ] Enable OAuth providers (Google, GitHub) if needed
- [ ] Set session timeout to 7 days
- [ ] Enable multi-factor authentication for admin accounts

## Rate Limiting

- Supabase Auth: Built-in rate limiting (adjust in Dashboard > Authentication > Rate Limits)
- API routes: Rate limiting implemented in `src/lib/security/rate-limit.ts` (50 req/min per IP)
- File uploads: Limited to 10MB via `src/lib/security/file-upload.ts`
