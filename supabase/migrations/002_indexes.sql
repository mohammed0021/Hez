-- ============================================================================
-- Hêz Fitness Tracker — Indexes
-- ============================================================================

-- Enable pg_trgm for fuzzy exercise search (required before gin_trgm_ops index)
create extension if not exists pg_trgm;

-- PROFILES
create index idx_profiles_username on public.profiles(username);

-- WORKOUTS
create index idx_workouts_user_id on public.workouts(user_id);
create index idx_workouts_started_at on public.workouts(user_id, started_at desc);
create index idx_workouts_program_day on public.workouts(program_day_id);
create index idx_workouts_source on public.workouts(user_id, source);

-- EXERCISE LIBRARY
create index idx_exercise_library_category on public.exercise_library(category);
create index idx_exercise_library_muscle_group on public.exercise_library using gin(muscle_group);
create index idx_exercise_library_equipment on public.exercise_library using gin(equipment);
create index idx_exercise_library_difficulty on public.exercise_library(difficulty);
create index idx_exercise_library_name on public.exercise_library using gin(name gin_trgm_ops);
create index idx_exercise_library_custom on public.exercise_library(is_custom, created_by);

-- WORKOUT EXERCISES
create index idx_workout_exercises_workout on public.workout_exercises(workout_id);
create index idx_workout_exercises_exercise on public.workout_exercises(exercise_id);
create index idx_workout_exercises_order on public.workout_exercises(workout_id, sort_order);

-- EXERCISE SETS
create index idx_exercise_sets_workout_exercise on public.exercise_sets(workout_exercise_id);
create index idx_exercise_sets_number on public.exercise_sets(workout_exercise_id, set_number);

-- PROGRAMS
create index idx_workout_programs_public on public.workout_programs(is_public, is_official);
create index idx_workout_programs_difficulty on public.workout_programs(difficulty);
create index idx_workout_programs_goal on public.workout_programs(goal);
create index idx_workout_programs_created_by on public.workout_programs(created_by);

-- PROGRAM DAYS
create index idx_program_days_program on public.program_days(program_id);
create index idx_program_days_number on public.program_days(program_id, day_number);

-- PROGRAM DAY EXERCISES
create index idx_program_day_exercises_day on public.program_day_exercises(program_day_id);
create index idx_program_day_exercises_order on public.program_day_exercises(program_day_id, sort_order);

-- BODY MEASUREMENTS
create index idx_body_measurements_user on public.body_measurements(user_id);
create index idx_body_measurements_date on public.body_measurements(user_id, measured_at desc);

-- WEIGHT LOGS
create index idx_weight_logs_user on public.weight_logs(user_id);
create index idx_weight_logs_date on public.weight_logs(user_id, logged_at desc);

-- PROGRESS PHOTOS
create index idx_progress_photos_user on public.progress_photos(user_id);
create index idx_progress_photos_date on public.progress_photos(user_id, taken_at desc);

-- NUTRITION LOGS
create index idx_nutrition_logs_user on public.nutrition_logs(user_id);
create index idx_nutrition_logs_date on public.nutrition_logs(user_id, logged_at desc);
create index idx_nutrition_logs_meal on public.nutrition_logs(user_id, meal_type);

-- WATER LOGS
create index idx_water_logs_user on public.water_logs(user_id);
create index idx_water_logs_date on public.water_logs(user_id, logged_at desc);

-- SUPPLEMENT LOGS
create index idx_supplement_logs_user on public.supplement_logs(user_id);
create index idx_supplement_logs_date on public.supplement_logs(user_id, logged_at desc);

-- SUPPLEMENT REMINDERS
create index idx_supplement_reminders_user on public.supplement_reminders(user_id);
create index idx_supplement_reminders_enabled on public.supplement_reminders(user_id, enabled);

-- NOTIFICATIONS
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_user_read on public.notifications(user_id, read);
create index idx_notifications_created on public.notifications(user_id, created_at desc);

-- ACHIEVEMENTS
create index idx_achievements_category on public.achievements(category);
create index idx_achievements_criteria on public.achievements(criteria_type);

-- USER ACHIEVEMENTS
create index idx_user_achievements_user on public.user_achievements(user_id);

-- CHALLENGES
create index idx_challenges_dates on public.challenges(start_date, end_date);
create index idx_challenges_type on public.challenges(challenge_type);

-- USER CHALLENGES
create index idx_user_challenges_user on public.user_challenges(user_id);
create index idx_user_challenges_challenge on public.user_challenges(challenge_id);
create index idx_user_challenges_progress on public.user_challenges(user_id, challenge_id);

-- PERSONAL RECORDS
create index idx_personal_records_user on public.personal_records(user_id);
create index idx_personal_records_exercise on public.personal_records(user_id, exercise_id);
create index idx_personal_records_type on public.personal_records(user_id, record_type);

-- ANALYTICS SNAPSHOTS
create index idx_analytics_snapshots_user on public.analytics_snapshots(user_id);
create index idx_analytics_snapshots_date on public.analytics_snapshots(user_id, snapshot_date desc);

