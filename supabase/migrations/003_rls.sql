-- ============================================================================
-- Hêz Fitness Tracker — Row Level Security
-- ============================================================================

-- Drop all existing policies on our tables so this file is re-runnable
do $$
declare
  rec record;
begin
  for rec in
    select distinct tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles','workouts','exercise_library','workout_exercises','exercise_sets',
        'workout_programs','program_days','program_day_exercises','body_measurements',
        'weight_logs','progress_photos','nutrition_logs','water_logs','supplement_logs',
        'supplement_reminders','notifications','achievements','user_achievements',
        'challenges','user_challenges','personal_records','settings','analytics_snapshots'
      )
  loop
    execute format('drop policy if exists %I on public.%I', rec.policyname, rec.tablename);
  end loop;
end;
$$;

-- Helper: is the current user the owner of this row?
create or replace function public.is_owner(user_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select auth.uid() = user_id;
$$;

-- ===== PROFILES =====
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Allow reading public profile info (for social features)
create policy "Anyone can view limited profile data"
  on public.profiles for select
  using (true);

-- ===== WORKOUTS =====
alter table public.workouts enable row level security;

create policy "Users can view own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can create own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workouts"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- ===== EXERCISE LIBRARY =====
alter table public.exercise_library enable row level security;

create policy "Anyone can read exercises"
  on public.exercise_library for select
  using (true);

create policy "Users can create custom exercises"
  on public.exercise_library for insert
  with check (auth.uid() = created_by);

create policy "Creators can update their custom exercises"
  on public.exercise_library for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Creators can delete their custom exercises"
  on public.exercise_library for delete
  using (auth.uid() = created_by);

-- ===== WORKOUT EXERCISES =====
alter table public.workout_exercises enable row level security;

create policy "Users can view own workout exercises"
  on public.workout_exercises for select
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Users can create workout exercises"
  on public.workout_exercises for insert
  with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Users can update own workout exercises"
  on public.workout_exercises for update
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Users can delete own workout exercises"
  on public.workout_exercises for delete
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

-- ===== EXERCISE SETS =====
alter table public.exercise_sets enable row level security;

create policy "Users can view own sets"
  on public.exercise_sets for select
  using (exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));

create policy "Users can create sets"
  on public.exercise_sets for insert
  with check (exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));

create policy "Users can update own sets"
  on public.exercise_sets for update
  using (exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));

create policy "Users can delete own sets"
  on public.exercise_sets for delete
  using (exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  ));

-- ===== WORKOUT PROGRAMS =====
alter table public.workout_programs enable row level security;

create policy "Anyone can view public programs"
  on public.workout_programs for select
  using (is_public = true or auth.uid() = created_by);

create policy "Users can create programs"
  on public.workout_programs for insert
  with check (auth.uid() = created_by);

create policy "Creators can update own programs"
  on public.workout_programs for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Creators can delete own programs"
  on public.workout_programs for delete
  using (auth.uid() = created_by);

-- ===== PROGRAM DAYS =====
alter table public.program_days enable row level security;

create policy "Anyone can view program days for public programs"
  on public.program_days for select
  using (exists (
    select 1 from public.workout_programs p
    where p.id = program_id and (p.is_public = true or p.created_by = auth.uid())
  ));

create policy "Creators can manage program days"
  on public.program_days for insert
  with check (exists (select 1 from public.workout_programs p where p.id = program_id and p.created_by = auth.uid()));

create policy "Creators can update program days"
  on public.program_days for update
  using (exists (select 1 from public.workout_programs p where p.id = program_id and p.created_by = auth.uid()));

create policy "Creators can delete program days"
  on public.program_days for delete
  using (exists (select 1 from public.workout_programs p where p.id = program_id and p.created_by = auth.uid()));

-- ===== PROGRAM DAY EXERCISES =====
alter table public.program_day_exercises enable row level security;

create policy "Anyone can view program day exercises"
  on public.program_day_exercises for select
  using (exists (
    select 1 from public.program_days pd
    join public.workout_programs p on p.id = pd.program_id
    where pd.id = program_day_id and (p.is_public = true or p.created_by = auth.uid())
  ));

create policy "Creators can manage program day exercises"
  on public.program_day_exercises for insert
  with check (exists (
    select 1 from public.program_days pd
    join public.workout_programs p on p.id = pd.program_id
    where pd.id = program_day_id and p.created_by = auth.uid()
  ));

create policy "Creators can update program day exercises"
  on public.program_day_exercises for update
  using (exists (
    select 1 from public.program_days pd
    join public.workout_programs p on p.id = pd.program_id
    where pd.id = program_day_id and p.created_by = auth.uid()
  ));

create policy "Creators can delete program day exercises"
  on public.program_day_exercises for delete
  using (exists (
    select 1 from public.program_days pd
    join public.workout_programs p on p.id = pd.program_id
    where pd.id = program_day_id and p.created_by = auth.uid()
  ));

-- ===== BODY MEASUREMENTS =====
alter table public.body_measurements enable row level security;

create policy "Users can view own measurements"
  on public.body_measurements for select
  using (auth.uid() = user_id);

create policy "Users can create own measurements"
  on public.body_measurements for insert
  with check (auth.uid() = user_id);

create policy "Users can update own measurements"
  on public.body_measurements for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own measurements"
  on public.body_measurements for delete
  using (auth.uid() = user_id);

-- ===== WEIGHT LOGS =====
alter table public.weight_logs enable row level security;

create policy "Users can view own weight logs"
  on public.weight_logs for select
  using (auth.uid() = user_id);

create policy "Users can create weight logs"
  on public.weight_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weight logs"
  on public.weight_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own weight logs"
  on public.weight_logs for delete
  using (auth.uid() = user_id);

-- ===== PROGRESS PHOTOS =====
alter table public.progress_photos enable row level security;

create policy "Users can view own progress photos"
  on public.progress_photos for select
  using (auth.uid() = user_id);

create policy "Users can create progress photos"
  on public.progress_photos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress photos"
  on public.progress_photos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own progress photos"
  on public.progress_photos for delete
  using (auth.uid() = user_id);

-- ===== NUTRITION LOGS =====
alter table public.nutrition_logs enable row level security;

create policy "Users can view own nutrition logs"
  on public.nutrition_logs for select
  using (auth.uid() = user_id);

create policy "Users can create nutrition logs"
  on public.nutrition_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own nutrition logs"
  on public.nutrition_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own nutrition logs"
  on public.nutrition_logs for delete
  using (auth.uid() = user_id);

-- ===== WATER LOGS =====
alter table public.water_logs enable row level security;

create policy "Users can view own water logs"
  on public.water_logs for select
  using (auth.uid() = user_id);

create policy "Users can create water logs"
  on public.water_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own water logs"
  on public.water_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own water logs"
  on public.water_logs for delete
  using (auth.uid() = user_id);

-- ===== SUPPLEMENT LOGS =====
alter table public.supplement_logs enable row level security;

create policy "Users can view own supplement logs"
  on public.supplement_logs for select
  using (auth.uid() = user_id);

create policy "Users can create supplement logs"
  on public.supplement_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own supplement logs"
  on public.supplement_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own supplement logs"
  on public.supplement_logs for delete
  using (auth.uid() = user_id);

-- ===== SUPPLEMENT REMINDERS =====
alter table public.supplement_reminders enable row level security;

create policy "Users can view own reminders"
  on public.supplement_reminders for select
  using (auth.uid() = user_id);

create policy "Users can create reminders"
  on public.supplement_reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reminders"
  on public.supplement_reminders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own reminders"
  on public.supplement_reminders for delete
  using (auth.uid() = user_id);

-- ===== NOTIFICATIONS =====
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications are inserted by the system (via triggers/functions) — service key needed
create policy "System can create notifications"
  on public.notifications for insert
  with check (true);

-- ===== ACHIEVEMENTS =====
alter table public.achievements enable row level security;

create policy "Anyone can view achievements"
  on public.achievements for select
  using (true);

-- Achievements are managed via Supabase dashboard / service role
create policy "Only service role can manage achievements"
  on public.achievements for insert
  with check (auth.role() = 'service_role');

create policy "Only service role can update achievements"
  on public.achievements for update
  using (auth.role() = 'service_role');

-- ===== USER ACHIEVEMENTS =====
alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

-- System inserts achievements when criteria are met
create policy "System can award achievements"
  on public.user_achievements for insert
  with check (true);

-- ===== CHALLENGES =====
alter table public.challenges enable row level security;

create policy "Anyone can view challenges"
  on public.challenges for select
  using (true);

create policy "Only service role can manage challenges"
  on public.challenges for insert
  with check (auth.role() = 'service_role');

create policy "Only service role can update challenges"
  on public.challenges for update
  using (auth.role() = 'service_role');

-- ===== USER CHALLENGES =====
alter table public.user_challenges enable row level security;

create policy "Users can view own challenge participation"
  on public.user_challenges for select
  using (auth.uid() = user_id);

create policy "Users can join challenges"
  on public.user_challenges for insert
  with check (auth.uid() = user_id);

create policy "Users can update own challenge progress"
  on public.user_challenges for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===== PERSONAL RECORDS =====
alter table public.personal_records enable row level security;

create policy "Users can view own records"
  on public.personal_records for select
  using (auth.uid() = user_id);

-- Records are calculated and inserted by the system
create policy "System can insert records"
  on public.personal_records for insert
  with check (auth.role() = 'service_role');

-- Users can update their own personal records (e.g., manually correcting a PR)
create policy "Users can update own records"
  on public.personal_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===== SETTINGS =====
alter table public.settings enable row level security;

create policy "Users can view own settings"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "Users can create own settings"
  on public.settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===== ANALYTICS SNAPSHOTS =====
alter table public.analytics_snapshots enable row level security;

create policy "Users can view own analytics"
  on public.analytics_snapshots for select
  using (auth.uid() = user_id);

create policy "System can create analytics snapshots"
  on public.analytics_snapshots for insert
  with check (auth.role() = 'service_role');

create policy "System can update analytics snapshots"
  on public.analytics_snapshots for update
  using (auth.role() = 'service_role');
