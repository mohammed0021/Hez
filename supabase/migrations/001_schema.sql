-- ============================================================================
-- Hêz Fitness Tracker — PostgreSQL Schema
-- Target: Supabase (PostgreSQL 15+)
-- ============================================================================

-- 1. PROFILES
-- Extends auth.users with fitness-specific fields.
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  username          text unique,
  display_name      text not null,
  avatar_url        text,
  bio               text check (char_length(bio) <= 160),
  goal              text check (goal in ('lose_weight','build_muscle','maintain','improve_endurance','general_fitness')),
  height_cm         numeric(5,1) check (height_cm > 0),
  weight_unit       text not null default 'kg' check (weight_unit in ('kg','lb')),
  height_unit       text not null default 'cm' check (height_unit in ('cm','ft_in')),
  date_of_birth     date,
  gender            text check (gender in ('male','female','non_binary','prefer_not_to_say')),
  onboarding_completed boolean not null default false,
  timezone          text not null default 'UTC',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Automatically create a profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. WORKOUTS
create table if not exists public.workouts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  name              text not null,
  notes             text,
  started_at        timestamptz,
  completed_at      timestamptz,
  duration_minutes  int check (duration_minutes > 0),
  feeling           int check (feeling between 1 and 5),
  calories_burned   int check (calories_burned >= 0),
  program_day_id    uuid,               -- FK added after program_days exists
  is_template       boolean not null default false,
  source            text default 'manual' check (source in ('manual','program','ai')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 3. EXERCISE LIBRARY
create table if not exists public.exercise_library (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  category          text not null check (category in (
    'strength','cardio','flexibility','hiit','bodyweight','olympic','plyometric','sports'
  )),
  muscle_group      text[] not null default '{}',
  equipment         text[] not null default '{}',
  difficulty        text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  instructions      text[] default '{}',
  video_url         text,
  image_url         text,
  is_custom         boolean not null default false,
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 4. WORKOUT EXERCISES (join table)
create table if not exists public.workout_exercises (
  id                uuid primary key default gen_random_uuid(),
  workout_id        uuid not null references public.workouts(id) on delete cascade,
  exercise_id       uuid not null references public.exercise_library(id) on delete cascade,
  sort_order        int not null default 0,
  notes             text,
  target_sets       int check (target_sets > 0),
  target_reps       text,               -- e.g. "8-12", "failure", "AMRAP"
  target_rpe        numeric(3,1) check (target_rpe between 1 and 10),
  rest_seconds      int check (rest_seconds >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 5. EXERCISE SETS
create table if not exists public.exercise_sets (
  id                uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number        int not null check (set_number > 0),
  reps              int check (reps >= 0),
  weight_kg         numeric(6,2) check (weight_kg >= 0),
  duration_seconds  int check (duration_seconds >= 0),
  distance_meters   numeric(7,2) check (distance_meters >= 0),
  rpe               int check (rpe between 1 and 10),
  completed         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 6. WORKOUT PROGRAMS
create table if not exists public.workout_programs (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  difficulty        text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  duration_weeks    int not null check (duration_weeks between 1 and 52),
  days_per_week     int not null check (days_per_week between 1 and 7),
  goal              text check (goal in ('strength','hypertrophy','endurance','weight_loss','general')),
  created_by        uuid references public.profiles(id) on delete set null,
  is_public         boolean not null default false,
  is_official       boolean not null default false,
  metadata          jsonb default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 7. PROGRAM DAYS
create table if not exists public.program_days (
  id                uuid primary key default gen_random_uuid(),
  program_id        uuid not null references public.workout_programs(id) on delete cascade,
  day_number        int not null check (day_number > 0),
  name              text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- FK from workouts to program_days (circular-safe)
alter table public.workouts
  drop constraint if exists fk_workouts_program_day,
  add constraint fk_workouts_program_day
  foreign key (program_day_id) references public.program_days(id) on delete set null;


-- 8. PROGRAM DAY EXERCISES (template for a program day)
create table if not exists public.program_day_exercises (
  id                uuid primary key default gen_random_uuid(),
  program_day_id    uuid not null references public.program_days(id) on delete cascade,
  exercise_id       uuid not null references public.exercise_library(id) on delete cascade,
  sort_order        int not null default 0,
  target_sets       int check (target_sets > 0),
  target_reps       text,
  target_rpe        numeric(3,1) check (target_rpe between 1 and 10),
  rest_seconds      int check (rest_seconds >= 0),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 9. BODY MEASUREMENTS
create table if not exists public.body_measurements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  measured_at       timestamptz not null default now(),
  chest_cm          numeric(5,1) check (chest_cm > 0),
  waist_cm          numeric(5,1) check (waist_cm > 0),
  hips_cm           numeric(5,1) check (hips_cm > 0),
  arms_cm           numeric(5,1) check (arms_cm > 0),
  thighs_cm         numeric(5,1) check (thighs_cm > 0),
  calves_cm         numeric(5,1) check (calves_cm > 0),
  shoulders_cm      numeric(5,1) check (shoulders_cm > 0),
  neck_cm           numeric(5,1) check (neck_cm > 0),
  body_fat_percentage numeric(4,1) check (body_fat_percentage between 0 and 100),
  notes             text,
  created_at        timestamptz not null default now()
);


-- 10. WEIGHT LOGS
create table if not exists public.weight_logs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  weight_kg         numeric(5,2) not null check (weight_kg > 0),
  logged_at         timestamptz not null default now(),
  notes             text,
  created_at        timestamptz not null default now()
);


-- 11. PROGRESS PHOTOS
create table if not exists public.progress_photos (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  photo_urls        jsonb not null default '[]',   -- array of { url, angle, taken_at }
  category          text check (category in ('front','back','side','arms','legs','custom')),
  taken_at          timestamptz not null default now(),
  notes             text,
  created_at        timestamptz not null default now()
);


-- 12. NUTRITION LOGS
create table if not exists public.nutrition_logs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  logged_at         timestamptz not null default now(),
  meal_type         text not null check (meal_type in ('breakfast','lunch','dinner','snack','pre_workout','post_workout')),
  food_name         text not null,
  portion_size      text,
  calories          int check (calories >= 0),
  protein_g         numeric(6,1) check (protein_g >= 0),
  carbs_g           numeric(6,1) check (carbs_g >= 0),
  fat_g             numeric(6,1) check (fat_g >= 0),
  fiber_g           numeric(6,1) check (fiber_g >= 0),
  sugar_g           numeric(6,1) check (sugar_g >= 0),
  sodium_mg         numeric(7,1) check (sodium_mg >= 0),
  notes             text,
  created_at        timestamptz not null default now()
);


-- 13. WATER LOGS
create table if not exists public.water_logs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  amount_ml         int not null check (amount_ml > 0),
  logged_at         timestamptz not null default now(),
  created_at        timestamptz not null default now()
);


-- 14. SUPPLEMENT LOGS
create table if not exists public.supplement_logs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  supplement_name   text not null,
  dosage            text,
  logged_at         timestamptz not null default now(),
  reminder_id       uuid,               -- FK added after supplement_reminders exists
  created_at        timestamptz not null default now()
);


-- 15. SUPPLEMENT REMINDERS
create table if not exists public.supplement_reminders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  supplement_name   text not null,
  dosage            text,
  time_of_day       time not null,
  days_of_week      int[] not null default '{0,1,2,3,4,5,6}', -- 0=Sun .. 6=Sat
  enabled           boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.supplement_logs
  add constraint fk_supplement_logs_reminder
  foreign key (reminder_id) references public.supplement_reminders(id) on delete set null;


-- 16. NOTIFICATIONS
create table if not exists public.notifications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  title             text not null,
  body              text,
  type              text not null check (type in (
    'workout_reminder','achievement_unlocked','challenge','progress','system','social'
  )),
  data              jsonb default '{}',
  read              boolean not null default false,
  created_at        timestamptz not null default now()
);


-- 17. ACHIEVEMENTS
create table if not exists public.achievements (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text not null,
  icon              text,
  category          text not null check (category in (
    'workouts','strength','consistency','nutrition','social','milestone'
  )),
  criteria_type     text not null check (criteria_type in (
    'workout_count','total_volume','streak_days','weight_milestone','personal_record',
    'challenge_complete','social_share','body_measurement'
  )),
  criteria_value    jsonb not null default '{}',
  xp_reward         int not null default 0 check (xp_reward >= 0),
  created_at        timestamptz not null default now()
);


-- 18. USER ACHIEVEMENTS
create table if not exists public.user_achievements (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  achievement_id    uuid not null references public.achievements(id) on delete cascade,
  earned_at         timestamptz not null default now(),
  unique(user_id, achievement_id)
);


-- 19. CHALLENGES
create table if not exists public.challenges (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  start_date        date not null,
  end_date          date not null check (end_date > start_date),
  challenge_type    text not null check (challenge_type in (
    'individual','group','global'
  )),
  goal_type         text not null check (goal_type in (
    'workout_count','total_volume','total_duration','weight_loss','streak_days','distance'
  )),
  goal_value        numeric not null check (goal_value > 0),
  icon              text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- 20. USER CHALLENGES
create table if not exists public.user_challenges (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  challenge_id      uuid not null references public.challenges(id) on delete cascade,
  progress          numeric not null default 0 check (progress >= 0),
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  unique(user_id, challenge_id)
);


-- 21. PERSONAL RECORDS
create table if not exists public.personal_records (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  exercise_id       uuid not null references public.exercise_library(id) on delete cascade,
  record_type       text not null check (record_type in (
    'max_weight','max_reps','best_volume','best_time','best_distance'
  )),
  value             numeric not null check (value > 0),
  achieved_at       timestamptz not null default now(),
  workout_exercise_id uuid references public.workout_exercises(id) on delete set null,
  unique(user_id, exercise_id, record_type)
);


-- 22. SETTINGS
create table if not exists public.settings (
  user_id               uuid primary key references public.profiles(id) on delete cascade,
  theme_id              text not null default 'hez-green',
  mode                  text not null default 'system' check (mode in ('light','dark','system')),
  language              text not null default 'en',
  measurement_system    text not null default 'metric' check (measurement_system in ('metric','imperial')),
  notifications_enabled boolean not null default true,
  workout_reminders     jsonb default '{"enabled": true, "time": "07:00", "days": [0,1,2,3,4,5,6]}',
  rest_timer_default    int not null default 90 check (rest_timer_default between 15 and 300),
  weekly_goal_workouts  int not null default 4 check (weekly_goal_workouts between 0 and 14),
  weekly_goal_water_ml  int default 2000 check (weekly_goal_water_ml >= 0),
  daily_calorie_goal    int check (daily_calorie_goal >= 0),
  dietary_preferences   text[] default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Auto-create settings row for new profiles
create or replace function public.handle_new_profile_settings()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.settings (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile_settings();


-- 23. ANALYTICS SNAPSHOTS
create table if not exists public.analytics_snapshots (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  snapshot_date     date not null default current_date,
  data              jsonb not null default '{}',
  unique(user_id, snapshot_date)
);


-- UPDATED_AT triggers for every table that has the column
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  tbl text;
begin
  for tbl in
    select table_name from information_schema.columns
    where column_name = 'updated_at'
      and table_schema = 'public'
      and table_name not in ('body_measurements','weight_logs','progress_photos','nutrition_logs','water_logs','supplement_logs','notifications','achievements','user_achievements','challenges','user_challenges','personal_records','analytics_snapshots')
  loop
    execute format(
      'create trigger trg_%s_updated_at before update on %I for each row execute function public.handle_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;
