-- ============================================================================
-- Hêz Fitness Tracker — Exercise Library Seed Data
-- ============================================================================

-- Clear existing seed data for idempotency
truncate table public.exercise_library cascade;
truncate table public.achievements cascade;

insert into public.exercise_library (name, description, category, muscle_group, equipment, difficulty, instructions) values

-- ===== CHEST =====
('Flat Barbell Bench Press', 'Lie on a flat bench and press a barbell from chest to full arm extension', 'strength', '{"chest","triceps","shoulders"}', '{"barbell","bench"}', 'intermediate',
  '{"Lie flat on the bench with feet planted on the floor.","Grip the bar slightly wider than shoulder-width.","Unrack and lower the bar to your mid-chest.","Press the bar up until arms are fully extended."}'),

('Incline Dumbbell Press', 'Press dumbbells upward on an inclined bench to target upper chest', 'strength', '{"upper_chest","shoulders","triceps"}', '{"dumbbells","bench"}', 'intermediate',
  '{"Set the bench to a 30-45 degree incline.","Hold dumbbells at shoulder height.","Press up until arms are extended.","Lower the dumbbells slowly back to start."}'),

('Push-Up', 'Classic bodyweight exercise targeting chest, shoulders, and triceps', 'bodyweight', '{"chest","triceps","shoulders","core"}', '{"bodyweight"}', 'beginner',
  '{"Start in a plank with hands slightly wider than shoulders.","Lower your body until chest nearly touches the floor.","Keep your core tight and body in a straight line.","Push back up to the starting position."}'),

('Cable Flyes', 'Cable crossover movement isolating the chest with constant tension', 'strength', '{"chest","shoulders"}', '{"cable","machine"}', 'intermediate',
  '{"Set pulleys to shoulder height.","Stand in the center, grab each handle.","Step forward and lean slightly.","Bring hands together in front of your chest with a slight bend in elbows."}'),

('Dumbbell Pull-Over', 'Pull a single dumbbell from behind the head to above the chest', 'strength', '{"chest","lats","triceps"}', '{"dumbbell","bench"}', 'intermediate',
  '{"Lie across a bench with only upper back supported.","Hold one dumbbell with both hands above chest.","Lower the dumbbell behind your head.","Pull it back to the starting position using your chest and lats."}'),

-- ===== BACK =====
('Deadlift', 'Full-body pulling movement lifting a loaded bar from the ground to hip height', 'strength', '{"back","glutes","hamstrings","core","traps"}', '{"barbell","bumper_plates"}', 'advanced',
  '{"Stand with feet hip-width, bar over midfoot.","Bend at hips and knees to grip the bar.","Keep your back straight and chest up.","Drive through your heels to stand up with the bar."}'),

('Pull-Up', 'Vertical pull using an overhead bar to target the back and biceps', 'bodyweight', '{"lats","biceps","back","shoulders"}', '{"pull_up_bar"}', 'intermediate',
  '{"Grip the bar with palms facing away, hands shoulder-width.","Hang with arms fully extended.","Pull yourself up until your chin clears the bar.","Lower yourself with control."}'),

('Barbell Row', 'Bent-over rowing movement targeting the mid-back', 'strength', '{"back","biceps","lats","rhomboids"}', '{"barbell"}', 'intermediate',
  '{"Hinge at hips holding a barbell with overhand grip.","Keep your back flat and torso nearly parallel to floor.","Pull the bar to your lower ribcage.","Slowly lower the bar back down."}'),

('Lat Pulldown', 'Cable-based vertical pull targeting the lats', 'strength', '{"lats","biceps","back"}', '{"cable","machine"}', 'beginner',
  '{"Sit at the lat pulldown machine, adjust thigh pad.","Grip the bar wider than shoulder-width.","Pull the bar down to your upper chest.","Slowly return to the starting position."}'),

('Face Pull', 'Cable pull to the face targeting rear delts and upper back', 'strength', '{"rear_delts","traps","upper_back"}', '{"cable","rope"}', 'beginner',
  '{"Set a cable pulley to upper-chest height with rope attachment.","Grip the rope with both hands.","Pull the rope toward your face, separating the ends.","Slowly extend arms back to start."}'),

('Dumbbell Single-Arm Row', 'One-arm dumbbell row for unilateral back development', 'strength', '{"back","lats","biceps"}', '{"dumbbell","bench"}', 'beginner',
  '{"Place one knee and hand on a bench for support.","Hold a dumbbell in the other hand.","Pull the dumbbell to your hip, squeezing your back.","Lower with control."}'),

-- ===== SHOULDERS =====
('Overhead Press', 'Press a barbell from shoulders to full extension overhead', 'strength', '{"shoulders","triceps","core"}', '{"barbell"}', 'intermediate',
  '{"Stand with feet shoulder-width, bar at shoulder height.","Press the bar overhead until arms are fully extended.","Keep your core braced throughout.","Lower the bar back to shoulders."}'),

('Lateral Raise', 'Raise dumbbells out to the sides targeting the medial deltoid', 'strength', '{"shoulders","traps"}', '{"dumbbells"}', 'beginner',
  '{"Stand holding light dumbbells at your sides.","Raise arms out to the sides until parallel to the floor.","Keep a slight bend in your elbows.","Lower slowly back to the start."}'),

('Front Raise', 'Raise dumbbells in front of you to target the anterior deltoid', 'strength', '{"shoulders"}', '{"dumbbells"}', 'beginner',
  '{"Stand with dumbbells in front of thighs.","Raise one or both arms straight in front to shoulder height.","Lower with control."}'),

('Arnold Press', 'Rotating dumbbell press named after Arnold Schwarzenegger', 'strength', '{"shoulders","triceps"}', '{"dumbbells"}', 'intermediate',
  '{"Sit holding dumbbells in front of shoulders, palms facing you.","Press up while rotating palms to face forward.","Reverse the motion on the way down."}'),

('Reverse Flye', 'Rear delt isolation performed bent-over or on a pec deck machine', 'strength', '{"rear_delts","upper_back"}', '{"dumbbells"}', 'beginner',
  '{"Hinge forward with a flat back holding light dumbbells.","Raise arms out to the sides squeezing shoulder blades.","Lower with control."}'),

-- ===== LEGS =====
('Barbell Back Squat', 'Barbell placed on the upper back, squat down and stand back up', 'strength', '{"quads","glutes","hamstrings","core"}', '{"barbell","squat_rack"}', 'intermediate',
  '{"Position bar on upper traps, unrack and step back.","Feet shoulder-width apart, toes slightly out.","Squat down to at least parallel.","Drive through heels to stand back up."}'),

('Romanian Deadlift', 'Hip-hinge movement targeting hamstrings and glutes', 'strength', '{"hamstrings","glutes","lower_back"}', '{"barbell","dumbbells"}', 'intermediate',
  '{"Hold a barbell or dumbbells in front of thighs.","Hinge at hips pushing them back.","Lower the weight along your legs until you feel a hamstring stretch.","Squeeze glutes to return to standing."}'),

('Leg Press', 'Machine-based pressing movement for quadriceps', 'strength', '{"quads","glutes","hamstrings"}', '{"machine"}', 'beginner',
  '{"Sit in the leg press machine, feet shoulder-width on the platform.","Release the safety handles.","Lower the platform to a 90-degree knee angle.","Press through your heels to extend."}'),

('Walking Lunge', 'Alternating forward lunges targeting quads and glutes', 'strength', '{"quads","glutes","hamstrings"}', '{"bodyweight","dumbbells"}', 'beginner',
  '{"Stand tall, step forward with one leg.","Lower back knee until both knees are at 90 degrees.","Drive through the front heel to step forward with the other leg."}'),

('Leg Curl', 'Hamstring isolation on a lying or seated leg curl machine', 'strength', '{"hamstrings"}', '{"machine"}', 'beginner',
  '{"Lie face down on the machine, pad behind ankles.","Curl your legs toward your glutes.","Lower with control."}'),

('Leg Extension', 'Quadriceps isolation on a leg extension machine', 'strength', '{"quads"}', '{"machine"}', 'beginner',
  '{"Sit on the machine with pad over shins.","Extend your legs until straight.","Lower with control."}'),

('Bulgarian Split Squat', 'Single-leg squat with rear foot elevated on a bench', 'strength', '{"quads","glutes","hamstrings"}', '{"dumbbells","bench"}', 'intermediate',
  '{"Stand a few feet in front of a bench, place one foot behind on the bench.","Hold dumbbells at sides.","Lower your back knee toward the floor.","Drive through the front heel to stand."}'),

-- ===== GLUTES =====
('Hip Thrust', 'Barbell glute bridge with shoulders on a bench', 'strength', '{"glutes","hamstrings","core"}', '{"barbell","bench"}', 'intermediate',
  '{"Sit on the floor with upper back against a bench, barbell over hips.","Drive through heels to lift hips up.","Squeeze glutes at the top.","Lower with control."}'),

('Glute Bridge', 'Bodyweight hip lift targeting the glutes', 'bodyweight', '{"glutes","core","hamstrings"}', '{"bodyweight"}', 'beginner',
  '{"Lie on your back with knees bent, feet flat.","Lift your hips toward the ceiling squeezing glutes.","Hold briefly at the top, then lower."}'),

('Cable Kickback', 'Cable-based glute isolation', 'strength', '{"glutes"}', '{"cable","ankle_strap"}', 'beginner',
  '{"Attach ankle strap to cable at low position.","Facing the machine, kick the working leg straight back.","Squeeze glute at the top, return with control."}'),

-- ===== ARMS =====
('Barbell Bicep Curl', 'Standing curl with a straight barbell', 'strength', '{"biceps"}', '{"barbell"}', 'beginner',
  '{"Stand holding a barbell with palms up, hands shoulder-width.","Curl the bar toward your shoulders.","Lower with control without swinging."}'),

('Hammer Curl', 'Neutral-grip dumbbell curl for brachialis and brachioradialis', 'strength', '{"biceps","forearms"}', '{"dumbbells"}', 'beginner',
  '{"Hold dumbbells at sides with palms facing each other.","Curl the dumbbells while keeping palms facing in.","Lower slowly."}'),

('Tricep Pushdown', 'Cable-based tricep isolation', 'strength', '{"triceps"}', '{"cable","rope"}', 'beginner',
  '{"Attach a rope or bar to a high cable pulley.","Elbows at 90 degrees, push down until arms are straight.","Return with control, keeping elbows fixed."}'),

('Skull Crusher', 'Lying tricep extension with a barbell or dumbbells', 'strength', '{"triceps"}', '{"barbell","dumbbells"}', 'intermediate',
  '{"Lie on a bench holding a bar above your chest.","Lower the bar toward your forehead by bending elbows.","Extend back up, keeping upper arms stationary."}'),

('Preacher Curl', 'Concentration curl on a preacher bench', 'strength', '{"biceps"}', '{"barbell","dumbbells","ez_bar"}', 'intermediate',
  '{"Sit at a preacher bench with arms on the pad.","Curl the weight toward your shoulders.","Lower slowly without fully extending."}'),

('Dips', 'Bodyweight pressing movement targeting triceps and chest', 'bodyweight', '{"triceps","chest","shoulders"}', '{"parallel_bars","bodyweight"}', 'intermediate',
  '{"Grip parallel bars and lift yourself up.","Lower your body by bending elbows to 90 degrees.","Push back up to the starting position."}'),

-- ===== CORE =====
('Plank', 'Static core endurance exercise', 'bodyweight', '{"core","abs","lower_back"}', '{"bodyweight"}', 'beginner',
  '{"Start in a forearm plank position.","Keep your body in a straight line from head to heels.","Hold the position, breathing steadily."}'),

('Crunch', 'Basic abdominal flexion exercise', 'bodyweight', '{"abs","core"}', '{"bodyweight"}', 'beginner',
  '{"Lie on your back with knees bent, hands behind head.","Curl your shoulders off the floor.","Lower with control."}'),

('Hanging Leg Raise', 'Hanging from a bar, raise legs to target lower abs', 'bodyweight', '{"abs","hip_flexors","core"}', '{"pull_up_bar"}', 'advanced',
  '{"Hang from a bar with arms fully extended.","Raise your legs until they are parallel to the floor or higher.","Lower with control without swinging."}'),

('Russian Twist', 'Rotational core movement', 'bodyweight', '{"obliques","core","abs"}', '{"bodyweight","dumbbell"}', 'beginner',
  '{"Sit with knees bent, lean back slightly.","Rotate your torso side to side, touching the floor or a weight."}'),

('Dead Bug', 'Core-stability exercise with opposing limb movement', 'bodyweight', '{"core","abs","lower_back"}', '{"bodyweight"}', 'beginner',
  '{"Lie on your back with arms extended up and legs at 90 degrees.","Simultaneously extend one arm and the opposite leg toward the floor.","Return to start and repeat on the other side."}'),

('Cable Woodchopper', 'Rotational cable movement targeting obliques and core', 'strength', '{"obliques","core","shoulders"}', '{"cable"}', 'intermediate',
  '{"Set cable to shoulder height.","Stand sideways, grab handle with both hands.","Rotate torso away from the machine, pulling diagonally.","Return with control."}'),

-- ===== CARDIO =====
('Running', 'Sustained running on a track, road, or treadmill', 'cardio', '{"legs","glutes","core","lungs"}', '{"treadmill","none"}', 'beginner',
  '{"Begin at a comfortable pace.","Maintain upright posture with relaxed shoulders.","Land mid-foot and breathe rhythmically."}'),

('Cycling', 'Stationary or outdoor cycling for cardiovascular endurance', 'cardio', '{"quads","hamstrings","glutes"}', '{"stationary_bike","bicycle"}', 'beginner',
  '{"Adjust seat height so leg is nearly extended at the bottom.","Maintain a steady cadence of 70-90 RPM.","Keep upper body relaxed."}'),

('Jump Rope', 'Skipping rope for high-intensity cardio', 'cardio', '{"legs","shoulders","core","calves"}', '{"jump_rope"}', 'beginner',
  '{"Hold rope handles at hip height.","Jump just high enough for the rope to pass under feet.","Land softly on the balls of your feet."}'),

('Rowing Machine', 'Full-body rowing cardio', 'cardio', '{"back","legs","arms","core"}', '{"rowing_machine"}', 'beginner',
  '{"Start with knees bent, arms extended.","Drive with legs first, then pull handle to lower chest.","Extend arms, then bend knees to slide forward."}'),

('Burpee', 'Full-body explosive movement combining squat, push-up, and jump', 'hiit', '{"full_body","chest","quads","core"}', '{"bodyweight"}', 'intermediate',
  '{"Stand, then squat and place hands on the floor.","Kick feet back into a push-up position.","Perform a push-up, then jump feet back to squat.","Explosively jump up."}'),

('Mountain Climber', 'Dynamic plank movement for cardio and core', 'hiit', '{"core","shoulders","hip_flexors","legs"}', '{"bodyweight"}', 'beginner',
  '{"Start in a plank position.","Drive one knee toward your chest, then quickly switch legs.","Maintain a steady rhythm."}'),

('Battle Ropes', 'Wave-like rope movements for upper-body cardio', 'cardio', '{"shoulders","arms","core","back"}', '{"battle_ropes"}', 'intermediate',
  '{"Stand with feet hip-width, holding one end of rope in each hand.","Alternate arms to create continuous waves.","Maintain a slight bend in knees."}'),

-- ===== FLEXIBILITY =====
('Cat-Cow Stretch', 'Spinal mobility stretch on hands and knees', 'flexibility', '{"spine","lower_back","core"}', '{"bodyweight","yoga_mat"}', 'beginner',
  '{"Start on hands and knees.","Inhale, arch your back and look up (cow).","Exhale, round your spine and tuck chin (cat).","Alternate slowly."}'),

('Child''s Pose', 'Restorative hip and back stretch', 'flexibility', '{"hips","back","shoulders"}', '{"bodyweight","yoga_mat"}', 'beginner',
  '{"Kneel on the floor, sit back on heels.","Extend arms forward and lower your chest toward the floor.","Breathe deeply and hold."}'),

('World''s Greatest Stretch', 'Dynamic full-body mobility stretch', 'flexibility', '{"hips","spine","shoulders","hamstrings"}', '{"bodyweight"}', 'beginner',
  '{"Step into a lunge position with one foot forward.","Place the same-side hand on the floor.","Rotate the opposite arm toward the ceiling."," Return to start and switch sides."}'),

('Pigeon Pose', 'Deep external rotation stretch for hips and glutes', 'flexibility', '{"hips","glutes","piriformis"}', '{"bodyweight","yoga_mat"}', 'beginner',
  '{"Start in a plank, bring one knee forward and to the side.","Lower your hips, keeping the bent leg on the floor.","Fold forward for a deeper stretch."}'),

('Hamstring Stretch', 'Seated or standing stretch for the hamstrings', 'flexibility', '{"hamstrings","lower_back"}', '{"bodyweight","yoga_mat"}', 'beginner',
  '{"Sit with one leg extended, the other bent.","Hinge at the hips to reach toward the extended foot.","Hold and breathe."}'),

-- ===== OLYMPIC =====
('Power Clean', 'Explosive full-body pull from floor to rack position', 'olympic', '{"full_body","quads","back","shoulders"}', '{"barbell","bumper_plates"}', 'advanced',
  '{"Start with bar over midfoot in a deadlift position.","Jump the bar up by extending hips and knees.","Shrug and pull under the bar, catching it on the front of shoulders.","Stand up fully."}'),

('Hang Clean', 'Clean variation starting from the hang position', 'olympic', '{"full_body","quads","back","shoulders"}', '{"barbell","bumper_plates"}', 'advanced',
  '{"Start with the bar at mid-thigh.","Explosively extend hips and pull the bar up.","Catch the bar on the front of your shoulders.","Stand up."}'),

-- ===== PLYOMETRIC =====
('Box Jump', 'Explosive jump onto an elevated box', 'plyometric', '{"quads","glutes","calves","hamstrings"}', '{"plyo_box"}', 'intermediate',
  '{"Stand facing a sturdy box at knee-to-hip height.","Slightly squat then jump onto the box.","Land softly, fully standing on top.","Step down and repeat."}'),

('Jump Squat', 'Explosive squat with a jump at the top', 'plyometric', '{"quads","glutes","hamstrings","calves"}', '{"bodyweight"}', 'intermediate',
  '{"Squat down to parallel.","Explosively jump up, reaching for the ceiling.","Land softly and immediately descend into the next rep."}'),

-- ===== SPORTS =====
('Kettlebell Swing', 'Hip-driven swing with a kettlebell', 'strength', '{"glutes","hamstrings","core","back"}', '{"kettlebell"}', 'intermediate',
  '{"Stand with feet wider than hip-width, kettlebell on the floor.","Hinge at hips and grab the handle.","Swing the kettlebell to chest height by driving hips forward.","Let it swing back between your legs."}'),

('Farmer''s Carry', 'Loaded walking for grip strength and core stability', 'strength', '{"forearms","core","traps","legs"}', '{"dumbbells","kettlebells"}', 'beginner',
  '{"Hold a heavy weight in each hand at your sides.","Walk forward with a tall, stable posture.","Keep your core braced throughout."}'),

('Calf Raises', 'Standing calf raise targeting the gastrocnemius and soleus', 'strength', '{"calves"}', '{"bodyweight","dumbbells","smith_machine"}', 'beginner',
  '{"Stand with feet hip-width, holding weight if using.","Raise your heels as high as possible.","Lower slowly below parallel for a full stretch."}');

-- ============================================================================
-- ACHIEVEMENTS SEED
-- ============================================================================

insert into public.achievements (name, description, category, criteria_type, criteria_value, xp_reward) values
  ('First Workout', 'Complete your first workout', 'milestone', 'workout_count', '{"count": 1}', 50),
  ('Getting Started', 'Complete 5 workouts', 'consistency', 'workout_count', '{"count": 5}', 100),
  ('Dedicated', 'Complete 25 workouts', 'consistency', 'workout_count', '{"count": 25}', 250),
  ('Fitness Addict', 'Complete 100 workouts', 'consistency', 'workout_count', '{"count": 100}', 1000),
  ('Week Warrior', 'Work out 7 days in a row', 'consistency', 'streak_days', '{"days": 7}', 200),
  ('Fortress of Solitude', 'Work out 30 days in a row', 'consistency', 'streak_days', '{"days": 30}', 1000),
  ('Pumping Iron', 'Log 10,000 kg total volume', 'strength', 'total_volume', '{"volume_kg": 10000}', 300),
  ('Strong As An Ox', 'Log 100,000 kg total volume', 'strength', 'total_volume', '{"volume_kg": 100000}', 1000),
  ('Personal Best', 'Set a new personal record', 'strength', 'personal_record', '{"count": 1}', 150),
  ('Milestone Weight', 'Log a body weight entry', 'milestone', 'weight_milestone', '{"count": 1}', 25),
  ('Nutrition Tracker', 'Log 30 nutrition entries', 'nutrition', 'workout_count', '{"count": 30}', 200),
  ('Hydrated', 'Log 100 water entries', 'nutrition', 'workout_count', '{"count": 100}', 200),
  ('Challenge Accepted', 'Complete a challenge', 'social', 'challenge_complete', '{"count": 1}', 300),
  ('Progress Snapshot', 'Take a progress photo', 'milestone', 'body_measurement', '{"count": 1}', 50),
  ('Century Club', 'Complete 100 sets in a single workout', 'workouts', 'workout_count', '{"count": 100, "in_single_workout": true}', 500);
