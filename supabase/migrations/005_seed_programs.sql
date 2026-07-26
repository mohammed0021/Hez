-- ============================================================================
-- Hêz Fitness Tracker — Starter Programs Seed Data
-- ============================================================================

-- Clear existing seed programs for idempotency
truncate table public.workout_programs cascade;

do $$
declare
  pid     uuid;
  day_id  uuid;
begin

-- ========================================================================
-- PROGRAM 1: Beginner Full Body (3 days / week, 4 weeks)
-- ========================================================================
insert into public.workout_programs (name, description, difficulty, duration_weeks, days_per_week, goal, is_public, is_official)
values (
  'Beginner Full Body',
  'A simple 3-day full-body program designed for beginners. Build foundational strength with compound movements.',
  'beginner', 4, 3, 'general', true, true
)
returning id into pid;

-- Day 1: Full Body A
insert into public.program_days (program_id, day_number, name)
values (pid, 1, 'Full Body A')
returning id into day_id;

-- Exercises for Day 1
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 3, '8-12', 90 from public.exercise_library where name = 'Flat Barbell Bench Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 3, '8-12', 90 from public.exercise_library where name = 'Lat Pulldown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 90 from public.exercise_library where name = 'Walking Lunge';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Dumbbell Single-Arm Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '12-15', 60 from public.exercise_library where name = 'Lateral Raise';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '15-20', 45 from public.exercise_library where name = 'Plank';

-- Day 2: Full Body B
insert into public.program_days (program_id, day_number, name)
values (pid, 2, 'Full Body B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 3, '8-12', 90 from public.exercise_library where name = 'Barbell Back Squat';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 3, '8-12', 90 from public.exercise_library where name = 'Overhead Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '8-12', 90 from public.exercise_library where name = 'Barbell Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Glute Bridge';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Barbell Bicep Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 45 from public.exercise_library where name = 'Tricep Pushdown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 7, 1, '30 seconds', 30 from public.exercise_library where name = 'Cat-Cow Stretch';

-- Day 3: Full Body C
insert into public.program_days (program_id, day_number, name)
values (pid, 3, 'Full Body C')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 3, '6-10', 120 from public.exercise_library where name = 'Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 3, '8-12', 90 from public.exercise_library where name = 'Incline Dumbbell Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '8-12', 90 from public.exercise_library where name = 'Pull-Up';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Leg Extension';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Hammer Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 45 from public.exercise_library where name = 'Dead Bug';


-- ========================================================================
-- PROGRAM 2: Push Pull Legs (6 days / week, 8 weeks)
-- ========================================================================
insert into public.workout_programs (name, description, difficulty, duration_weeks, days_per_week, goal, is_public, is_official)
values (
  'Push Pull Legs Split',
  'The classic PPL split for intermediate lifters. Six days per week targeting each movement pattern twice.',
  'intermediate', 8, 6, 'hypertrophy', true, true
)
returning id into pid;

-- Day 1: Push A
insert into public.program_days (program_id, day_number, name)
values (pid, 1, 'Push A')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Flat Barbell Bench Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Overhead Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Incline Dumbbell Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '12-15', 60 from public.exercise_library where name = 'Lateral Raise';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Tricep Pushdown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Dumbbell Pull-Over';

-- Day 2: Pull A
insert into public.program_days (program_id, day_number, name)
values (pid, 2, 'Pull A')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Barbell Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '8-12', 90 from public.exercise_library where name = 'Pull-Up';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '12-15', 60 from public.exercise_library where name = 'Reverse Flye';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Barbell Bicep Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Face Pull';

-- Day 3: Legs A
insert into public.program_days (program_id, day_number, name)
values (pid, 3, 'Legs A')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Barbell Back Squat';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Romanian Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Leg Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Walking Lunge';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Leg Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Leg Extension';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 7, 3, '12-15', 60 from public.exercise_library where name = 'Calf Raises';

-- Day 4: Push B
insert into public.program_days (program_id, day_number, name)
values (pid, 4, 'Push B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '8-12', 90 from public.exercise_library where name = 'Overhead Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Incline Dumbbell Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-12', 60 from public.exercise_library where name = 'Cable Flyes';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '12-15', 60 from public.exercise_library where name = 'Front Raise';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '8-12', 60 from public.exercise_library where name = 'Skull Crusher';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-12', 60 from public.exercise_library where name = 'Arnold Press';

-- Day 5: Pull B
insert into public.program_days (program_id, day_number, name)
values (pid, 5, 'Pull B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Barbell Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Lat Pulldown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Dumbbell Single-Arm Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Hammer Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '12-15', 60 from public.exercise_library where name = 'Face Pull';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Preacher Curl';

-- Day 6: Legs B
insert into public.program_days (program_id, day_number, name)
values (pid, 6, 'Legs B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Bulgarian Split Squat';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Hip Thrust';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Leg Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Walking Lunge';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '15-20', 45 from public.exercise_library where name = 'Calf Raises';


-- ========================================================================
-- PROGRAM 3: Upper Lower Split (4 days / week, 6 weeks)
-- ========================================================================
insert into public.workout_programs (name, description, difficulty, duration_weeks, days_per_week, goal, is_public, is_official)
values (
  'Upper Lower Split',
  'A balanced 4-day upper/lower program for intermediate lifters. Build strength and size with focused sessions.',
  'intermediate', 6, 4, 'hypertrophy', true, true
)
returning id into pid;

-- Day 1: Upper A
insert into public.program_days (program_id, day_number, name)
values (pid, 1, 'Upper A')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Flat Barbell Bench Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '6-10', 120 from public.exercise_library where name = 'Barbell Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 4, '8-12', 90 from public.exercise_library where name = 'Overhead Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '8-12', 90 from public.exercise_library where name = 'Pull-Up';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Lateral Raise';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '8-12', 60 from public.exercise_library where name = 'Barbell Bicep Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 7, 3, '8-12', 60 from public.exercise_library where name = 'Skull Crusher';

-- Day 2: Lower A
insert into public.program_days (program_id, day_number, name)
values (pid, 2, 'Lower A')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Barbell Back Squat';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Romanian Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Leg Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Leg Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Leg Extension';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Plank';

-- Day 3: Upper B
insert into public.program_days (program_id, day_number, name)
values (pid, 3, 'Upper B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Incline Dumbbell Press';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '6-10', 120 from public.exercise_library where name = 'Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '8-12', 90 from public.exercise_library where name = 'Lat Pulldown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Dumbbell Single-Arm Row';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Front Raise';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '10-15', 60 from public.exercise_library where name = 'Tricep Pushdown';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 7, 3, '10-15', 60 from public.exercise_library where name = 'Hammer Curl';

-- Day 4: Lower B
insert into public.program_days (program_id, day_number, name)
values (pid, 4, 'Lower B')
returning id into day_id;

insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 1, 4, '6-10', 120 from public.exercise_library where name = 'Deadlift';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 2, 4, '8-12', 90 from public.exercise_library where name = 'Bulgarian Split Squat';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 3, 3, '10-15', 60 from public.exercise_library where name = 'Hip Thrust';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 4, 3, '10-15', 60 from public.exercise_library where name = 'Walking Lunge';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 5, 3, '10-15', 60 from public.exercise_library where name = 'Leg Curl';
insert into public.program_day_exercises (program_day_id, exercise_id, sort_order, target_sets, target_reps, rest_seconds)
select day_id, id, 6, 3, '15-20', 45 from public.exercise_library where name = 'Dead Bug';

end $$;
