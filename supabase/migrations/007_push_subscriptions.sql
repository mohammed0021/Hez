-- 26. PUSH SUBSCRIPTIONS
-- Durable web-push subscriptions so notifications can be delivered server-side
-- even when the app is closed (Vercel serverless has no shared in-memory store).

create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  endpoint     text not null unique,
  keys_p256dh  text not null,
  keys_auth    text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

create index if not exists push_subscriptions_endpoint_idx
  on public.push_subscriptions (endpoint);

-- ===== RLS =====
alter table public.push_subscriptions enable row level security;

create policy "Users can view own push subscriptions"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create own push subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own push subscriptions"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);

-- ===== NOTIFICATION PREFS + TIMEZONE (for server-side scheduling) =====
alter table public.settings
  add column if not exists notification_prefs jsonb not null default '{}',
  add column if not exists timezone text not null default 'UTC';
