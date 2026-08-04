-- 27. PROFILES: align schema with the client stores
-- The profile-store and onboarding/complete-profile flows read/write these
-- columns. Add them idempotently so existing deploy/schema stay in sync.

alter table public.profiles
  add column if not exists location text,
  add column if not exists birthday date,
  add column if not exists phone text,
  add column if not exists weight_kg numeric(5,1) check (weight_kg > 0),
  add column if not exists primary_goal text check (primary_goal in (
    'build_muscle','lose_fat','maintain','increase_strength','improve_endurance'
  )),
  add column if not exists experience_level text check (experience_level in (
    'beginner','intermediate','advanced'
  )),
  add column if not exists activity_level text check (activity_level in (
    'sedentary','light','moderate','active','very_active'
  )),
  add column if not exists weekly_workout_goal int check (weekly_workout_goal between 0 and 14),
  add column if not exists workout_duration int check (workout_duration between 1 and 360),
  add column if not exists unit_system text default 'metric' check (unit_system in ('metric','imperial')),
  add column if not exists profile_visibility text default 'private' check (profile_visibility in ('public','friends','private')),
  add column if not exists show_workout_history boolean not null default true,
  add column if not exists show_achievements boolean not null default true,
  add column if not exists show_body_stats boolean not null default true;

-- Backfill normalized fields from the legacy columns where present.
update public.profiles
set weight_kg = nullif(weight_kg, 0)
where weight_kg = 0;

-- 28. PUSH SUBSCRIPTIONS: allow anonymous (unauthenticated) subscriptions
-- The subscribe API is open (requireAuth:false). Anonymous users get
-- user_id = NULL; the old FK + RLS blocked their inserts.

alter table public.push_subscriptions
  alter column user_id drop not null;

alter table public.push_subscriptions
  drop constraint if exists push_subscriptions_user_id_fkey;

drop policy if exists "Users can create own push subscriptions"
  on public.push_subscriptions;

create policy "Users can create own push subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id or user_id is null);