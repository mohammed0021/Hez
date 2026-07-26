-- Add role column to profiles
alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'premium', 'admin'));

-- Create index for role lookups
create index if not exists idx_profiles_role on public.profiles(role);

-- Admin can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = id);

-- Admin can update any profile
create policy "Admins can update any profile"
  on public.profiles for update
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Admin can read all workouts
create policy "Admins can read all workouts"
  on public.workouts for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all nutrition logs
create policy "Admins can read all nutrition_logs"
  on public.nutrition_logs for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all body_measurements
create policy "Admins can read all body_measurements"
  on public.body_measurements for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all weight_logs
create policy "Admins can read all weight_logs"
  on public.weight_logs for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all supplement_logs
create policy "Admins can read all supplement_logs"
  on public.supplement_logs for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all water_logs
create policy "Admins can read all water_logs"
  on public.water_logs for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all personal_records
create policy "Admins can read all personal_records"
  on public.personal_records for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);

-- Admin can read all progress_photos
create policy "Admins can read all progress_photos"
  on public.progress_photos for select
  using (auth.jwt() ->> 'role' = 'admin' or auth.uid() = user_id);
