/**
 * EXERCISE DATABASE
 *
 * Each entry:
 *   name       display name
 *   primary    canonical muscle key (used by smart replacement)
 *   muscle     human-readable target muscle(s)
 *   equipment  barbell | dumbbell | machine | cable | bodyweight
 *   desc       short description
 *   tips[]     correct form tips
 *   mistakes[] common mistakes to avoid
 *   alts[]     curated direct substitutes (same movement pattern)
 */

export const EXERCISES = {
  /* ---------------- CHEST ---------------- */
  bench: {
    name: "Bench Press", primary: "chest", muscle: "Chest", equipment: "barbell",
    desc: "A barbell press performed lying on a flat bench. The primary compound movement for chest strength and size.",
    tips: ["Pin shoulder blades back and down into the bench", "Lower the bar to mid-chest under control", "Keep feet flat on the floor and drive through them"],
    mistakes: ["Bouncing the bar off the chest", "Flaring elbows out to 90 degrees", "Lifting hips off the bench"],
    alts: ["db_press", "incline_bb", "pushup"]
  },
  db_press: {
    name: "Dumbbell Press", primary: "chest", muscle: "Chest", equipment: "dumbbell",
    desc: "A flat dumbbell press allowing a greater range of motion and more natural shoulder path than a barbell.",
    tips: ["Lower until upper arms are roughly parallel to the floor", "Press up and slightly inward", "Keep core braced throughout"],
    mistakes: ["Letting the dumbbells drift too wide", "Using momentum instead of control", "Slamming the elbows into lockout"],
    alts: ["bench", "incline_db", "pushup"]
  },
  incline_bb: {
    name: "Incline Barbell Press", primary: "upper_chest", muscle: "Upper Chest", equipment: "barbell",
    desc: "A barbell press on an inclined bench that biases the upper portion of the chest.",
    tips: ["Set the bench to 30-45 degrees", "Lower the bar to your upper chest, not your neck", "Keep wrists stacked over elbows"],
    mistakes: ["Bar path drifting toward the neck", "Cutting the range of motion short", "Setting the incline too steep"],
    alts: ["incline_db", "bench"]
  },
  incline_db: {
    name: "Incline Dumbbell Press", primary: "upper_chest", muscle: "Upper Chest", equipment: "dumbbell",
    desc: "An inclined dumbbell press emphasising the upper chest with a longer range of motion.",
    tips: ["Set the bench to 30-45 degrees", "Drive the dumbbells up and slightly together", "Control the lowering phase"],
    mistakes: ["Too steep an incline (becomes a shoulder press)", "Excessive lower back arch", "Rushing the tempo"],
    alts: ["incline_bb", "db_press"]
  },
  cable_fly: {
    name: "Cable Fly", primary: "chest", muscle: "Chest", equipment: "cable",
    desc: "An isolation movement using cables to work the chest through a wide arc with constant tension.",
    tips: ["Keep a slight, fixed bend in the elbows", "Squeeze the chest at the midline", "Control the stretch at the start position"],
    mistakes: ["Swinging the cables with momentum", "Bending the elbows more as you go (turns it into a press)", "Letting the weight snap you back"],
    alts: ["pec_deck", "db_press"]
  },
  pec_deck: {
    name: "Pec Deck Machine", primary: "chest", muscle: "Chest", equipment: "machine",
    desc: "A machine-based chest isolation movement with a fixed, guided path.",
    tips: ["Set seat height so handles align with mid-chest", "Squeeze and pause briefly at the midline", "Keep back flat against the pad"],
    mistakes: ["Using too much weight and shrugging", "Partial range of motion", "Letting the arms snap back open"],
    alts: ["cable_fly"]
  },
  dips: {
    name: "Dips", primary: "chest", muscle: "Chest / Triceps", equipment: "bodyweight",
    desc: "A bodyweight press on parallel bars. Leaning forward biases the chest; staying upright biases the triceps.",
    tips: ["Lean the torso forward to target the chest", "Lower until shoulders are slightly below elbows", "Keep elbows moderately tucked"],
    mistakes: ["Going excessively deep and straining the shoulders", "Bouncing out of the bottom", "Shrugging the shoulders up"],
    alts: ["close_grip_bench", "pushup"]
  },
  pushup: {
    name: "Push-ups", primary: "chest", muscle: "Chest", equipment: "bodyweight",
    desc: "A bodyweight pressing exercise that also trains the core and shoulders. No equipment needed.",
    tips: ["Keep the body in one straight line from head to heels", "Lower the chest to just above the floor", "Keep elbows at roughly 45 degrees to the torso"],
    mistakes: ["Sagging or piking the hips", "Partial range of motion", "Flaring the elbows straight out"],
    alts: ["db_press", "bench"]
  },

  /* ---------------- BACK ---------------- */
  deadlift: {
    name: "Deadlift", primary: "back", muscle: "Back / Hamstrings", equipment: "barbell",
    desc: "A full-body hinge lifting a loaded barbell from the floor. One of the highest-return strength movements.",
    tips: ["Keep the bar close to your shins and body", "Brace the core hard before the bar leaves the floor", "Drive through the floor with your legs"],
    mistakes: ["Rounding the lower back", "Letting the bar drift away from the body", "Hyperextending/leaning back at lockout"],
    alts: ["rdl", "row_bb"]
  },
  pullup: {
    name: "Pull-ups", primary: "lats", muscle: "Lats / Upper Back", equipment: "bodyweight",
    desc: "A bodyweight vertical pull, the benchmark movement for lat width and pulling strength.",
    tips: ["Start from a full dead hang", "Pull your chest toward the bar", "Control the descent rather than dropping"],
    mistakes: ["Kipping or swinging for momentum", "Only performing half reps", "Shrugging instead of pulling with the lats"],
    alts: ["lat_pulldown"]
  },
  lat_pulldown: {
    name: "Lat Pulldown", primary: "lats", muscle: "Lats", equipment: "machine",
    desc: "A cable/machine vertical pull that mirrors the pull-up with adjustable load.",
    tips: ["Pull the bar to your upper chest", "Lead with the elbows, not the hands", "Avoid leaning back excessively"],
    mistakes: ["Using body momentum to yank the bar", "Pulling behind the neck", "Letting the weight pull you up uncontrolled"],
    alts: ["pullup"]
  },
  row_bb: {
    name: "Barbell Row", primary: "back", muscle: "Mid Back", equipment: "barbell",
    desc: "A hinged horizontal pull that builds thickness across the mid back.",
    tips: ["Hinge at the hips with a flat back", "Pull the bar toward your lower ribcage", "Squeeze the shoulder blades at the top"],
    mistakes: ["Rounding the lower back", "Jerking the torso upright to move the weight", "Standing too upright"],
    alts: ["row_db", "row_cable"]
  },
  row_db: {
    name: "Dumbbell Row", primary: "back", muscle: "Mid Back", equipment: "dumbbell",
    desc: "A single-arm horizontal pull with bench support, good for fixing side-to-side imbalances.",
    tips: ["Keep the back flat and roughly parallel to the floor", "Pull the elbow past the torso", "Avoid rotating through the spine"],
    mistakes: ["Twisting the torso to cheat the weight up", "Rounding the back", "Shortening the range of motion"],
    alts: ["row_bb", "row_cable"]
  },
  row_cable: {
    name: "Seated Cable Row", primary: "back", muscle: "Mid Back", equipment: "cable",
    desc: "A seated horizontal pull with constant cable tension throughout the movement.",
    tips: ["Sit tall with a slight forward lean at the stretch", "Pull the handle to your navel", "Retract the shoulder blades at the end"],
    mistakes: ["Rocking the torso back and forth", "Rounding the upper back at the stretch", "Pulling with the arms only"],
    alts: ["row_bb", "row_db"]
  },
  face_pull: {
    name: "Face Pulls", primary: "rear_delts", muscle: "Rear Delts / Upper Back", equipment: "cable",
    desc: "A cable pull to face height targeting the rear delts and upper back. Excellent for shoulder health and posture.",
    tips: ["Pull the rope toward your face with elbows high", "Externally rotate at the end of the pull", "Use light-to-moderate load"],
    mistakes: ["Going too heavy and losing the high-elbow position", "Pulling too low toward the chest", "Rushing the tempo"],
    alts: ["rear_delt_fly"]
  },
  shrugs: {
    name: "Shrugs", primary: "traps", muscle: "Traps", equipment: "dumbbell",
    desc: "An isolation movement elevating the shoulders to develop the upper trapezius.",
    tips: ["Lift the shoulders straight up toward the ears", "Pause briefly at the top", "Lower under control for a full stretch"],
    mistakes: ["Rolling the shoulders instead of straight up and down", "Bouncing with the knees to generate momentum", "Overloading and using a tiny range"],
    alts: ["face_pull"]
  },

  /* ---------------- SHOULDERS ---------------- */
  ohp: {
    name: "Overhead Press", primary: "shoulders", muscle: "Shoulders", equipment: "barbell",
    desc: "A standing barbell press overhead. The main compound builder for shoulder strength.",
    tips: ["Brace the core and squeeze the glutes", "Press the bar in a straight line, moving your head back slightly", "Finish with the bar over the mid-foot"],
    mistakes: ["Excessive lower back arch", "Flaring the elbows too wide at the start", "Stopping short of full lockout"],
    alts: ["db_shoulder_press", "machine_press"]
  },
  db_shoulder_press: {
    name: "Dumbbell Shoulder Press", primary: "shoulders", muscle: "Shoulders", equipment: "dumbbell",
    desc: "An overhead press with dumbbells, allowing a more shoulder-friendly path than a barbell.",
    tips: ["Start with dumbbells at ear height", "Press up and slightly inward", "Keep the core braced to avoid arching"],
    mistakes: ["Letting the dumbbells drift forward", "Partial range of motion", "Leaning back into a incline press position"],
    alts: ["ohp", "machine_press"]
  },
  machine_press: {
    name: "Machine Shoulder Press", primary: "shoulders", muscle: "Shoulders", equipment: "machine",
    desc: "A guided overhead press, useful for training shoulders safely to fatigue without balance demands.",
    tips: ["Adjust the seat so handles start at shoulder height", "Press smoothly to near-lockout", "Keep back against the pad"],
    mistakes: ["Setting the seat too low or too high", "Using a bouncing partial range", "Letting the weight stack slam down"],
    alts: ["db_shoulder_press", "ohp"]
  },
  lateral_raise: {
    name: "Lateral Raises", primary: "shoulders", muscle: "Side Delts", equipment: "dumbbell",
    desc: "An isolation movement for the side deltoid, the key exercise for shoulder width.",
    tips: ["Lead with the elbows, not the hands", "Raise to roughly shoulder height", "Keep a slight bend in the elbows"],
    mistakes: ["Swinging the weights with body momentum", "Shrugging the traps to lift higher", "Going far too heavy to use strict form"],
    alts: ["cable_lateral", "front_raise"]
  },
  cable_lateral: {
    name: "Cable Lateral Raise", primary: "shoulders", muscle: "Side Delts", equipment: "cable",
    desc: "A single-arm lateral raise with cable tension maintained through the whole range.",
    tips: ["Stand side-on to the cable", "Raise to shoulder height with a fixed elbow angle", "Resist the cable on the way down"],
    mistakes: ["Leaning away to cheat the weight up", "Letting the cable snap the arm down", "Using the traps to initiate"],
    alts: ["lateral_raise"]
  },
  front_raise: {
    name: "Front Raises", primary: "shoulders", muscle: "Front Delts", equipment: "dumbbell",
    desc: "An isolation movement for the anterior deltoid.",
    tips: ["Raise to shoulder height, no higher", "Keep a slight bend in the elbow", "Avoid swinging the torso"],
    mistakes: ["Generating momentum from the hips", "Going well past shoulder height", "Locking the elbows rigidly straight"],
    alts: ["lateral_raise"]
  },
  rear_delt_fly: {
    name: "Rear Delt Fly", primary: "rear_delts", muscle: "Rear Delts", equipment: "dumbbell",
    desc: "An isolation movement for the rear deltoid, performed bent-over or on a machine.",
    tips: ["Hinge forward with a flat back", "Lead with the elbows and squeeze the shoulder blades", "Use light-to-moderate weight"],
    mistakes: ["Bending the elbows so much it becomes a row", "Swinging the weights up with momentum", "Rounding the back"],
    alts: ["face_pull"]
  },

  /* ---------------- TRICEPS ---------------- */
  triceps_pushdown: {
    name: "Triceps Pushdown", primary: "triceps", muscle: "Triceps", equipment: "cable",
    desc: "A cable isolation movement for the triceps, easy to load and progress.",
    tips: ["Keep the elbows pinned to your sides", "Extend fully at the bottom", "Control the return upward"],
    mistakes: ["Letting the elbows drift forward", "Leaning your body weight onto the bar", "Not reaching full extension"],
    alts: ["oh_triceps_ext", "skull_crusher"]
  },
  oh_triceps_ext: {
    name: "Overhead Triceps Extension", primary: "triceps", muscle: "Triceps", equipment: "dumbbell",
    desc: "An extension performed with the arms overhead, which stretches and targets the long head of the triceps.",
    tips: ["Keep the elbows close to your head", "Lower behind the head under control for a deep stretch", "Extend fully without harsh lockout"],
    mistakes: ["Flaring the elbows out wide", "Arching the lower back to move heavier weight", "Using a short range of motion"],
    alts: ["triceps_pushdown", "skull_crusher"]
  },
  skull_crusher: {
    name: "Skull Crushers", primary: "triceps", muscle: "Triceps", equipment: "barbell",
    desc: "A lying triceps extension with an EZ-bar or barbell.",
    tips: ["Keep the upper arms roughly perpendicular to the floor", "Lower toward the forehead under control", "Extend fully at the top"],
    mistakes: ["Flaring the elbows outward", "Moving the upper arms during the rep", "Using weight that forces a partial range"],
    alts: ["oh_triceps_ext", "close_grip_bench"]
  },
  close_grip_bench: {
    name: "Close-Grip Bench Press", primary: "triceps", muscle: "Triceps", equipment: "barbell",
    desc: "A bench press with a narrower grip that shifts emphasis onto the triceps.",
    tips: ["Grip just inside shoulder width", "Keep the elbows tucked close to the body", "Lower the bar to the lower chest"],
    mistakes: ["Gripping so narrow it strains the wrists", "Flaring the elbows wide", "Bouncing the bar off the chest"],
    alts: ["skull_crusher", "dips"]
  },

  /* ---------------- BICEPS ---------------- */
  bb_curl: {
    name: "Barbell Curl", primary: "biceps", muscle: "Biceps", equipment: "barbell",
    desc: "The classic barbell curl for biceps mass and strength.",
    tips: ["Keep the elbows pinned at your sides", "Curl with control, no swinging", "Squeeze hard at the top of each rep"],
    mistakes: ["Using body momentum to swing the bar", "Letting the elbows drift forward", "Performing only partial reps"],
    alts: ["db_curl", "preacher_curl"]
  },
  db_curl: {
    name: "Dumbbell Curl", primary: "biceps", muscle: "Biceps", equipment: "dumbbell",
    desc: "A biceps curl with dumbbells, performed alternating or together, allowing full supination.",
    tips: ["Rotate the palm fully upward as you curl", "Keep the elbows stationary", "Lower under control to full extension"],
    mistakes: ["Swinging the dumbbells with momentum", "Moving the elbows forward and back", "Not fully extending at the bottom"],
    alts: ["bb_curl", "hammer_curl"]
  },
  hammer_curl: {
    name: "Hammer Curl", primary: "biceps", muscle: "Biceps / Forearms", equipment: "dumbbell",
    desc: "A neutral-grip curl hitting the brachialis and forearms alongside the biceps.",
    tips: ["Keep palms facing each other throughout", "Fix the elbows at your sides", "Control the lowering phase"],
    mistakes: ["Swinging the weight upward", "Letting the elbows flare out", "Adding shoulder movement to assist"],
    alts: ["db_curl", "bb_curl"]
  },
  preacher_curl: {
    name: "Preacher Curl", primary: "biceps", muscle: "Biceps", equipment: "dumbbell",
    desc: "A curl with the upper arm braced on a pad, removing all momentum for strict isolation.",
    tips: ["Keep the upper arms flat on the pad", "Curl through a full range of motion", "Avoid a harsh snap at the bottom stretch"],
    mistakes: ["Lifting the elbows off the pad", "Bouncing out of the bottom stretch", "Cutting the range short at the top"],
    alts: ["bb_curl", "db_curl"]
  },

  /* ---------------- QUADS / LEGS ---------------- */
  squat: {
    name: "Back Squat", primary: "quads", muscle: "Quads / Glutes", equipment: "barbell",
    desc: "The foundational lower-body compound lift, with the barbell racked across the upper back.",
    tips: ["Keep the chest up and core braced", "Push the knees out in line with the toes", "Descend to at least parallel depth"],
    mistakes: ["Knees caving inward", "Rounding the lower back at the bottom", "Rising hips-first into a good-morning position"],
    alts: ["front_squat", "leg_press", "goblet_squat"]
  },
  front_squat: {
    name: "Front Squat", primary: "quads", muscle: "Quads", equipment: "barbell",
    desc: "A squat with the bar racked across the front delts, placing more emphasis on the quads and upright posture.",
    tips: ["Keep the elbows high throughout", "Stay upright with the torso", "Drive up through the mid-foot"],
    mistakes: ["Letting the elbows drop, dumping the bar forward", "Rounding the upper back", "Rising onto the toes"],
    alts: ["squat", "leg_press"]
  },
  goblet_squat: {
    name: "Goblet Squat", primary: "quads", muscle: "Quads / Glutes", equipment: "dumbbell",
    desc: "A squat holding a single dumbbell at chest height. Beginner-friendly and teaches good squat position.",
    tips: ["Hold the weight tight against your chest", "Sit down between the hips", "Keep the torso upright"],
    mistakes: ["Letting the weight drift away from the body", "Rounding the back at depth", "Cutting depth short"],
    alts: ["squat", "leg_press"]
  },
  leg_press: {
    name: "Leg Press", primary: "quads", muscle: "Quads / Glutes", equipment: "machine",
    desc: "A machine compound lower-body press with minimal spinal loading.",
    tips: ["Place feet shoulder-width on the platform", "Lower until the knees reach about 90 degrees", "Avoid slamming into knee lockout"],
    mistakes: ["Letting the lower back round off the pad", "Going so deep the hips tuck under", "Using a very short range of motion"],
    alts: ["squat", "hack_squat", "lunge"]
  },
  hack_squat: {
    name: "Hack Squat", primary: "quads", muscle: "Quads", equipment: "machine",
    desc: "A guided squat machine that heavily loads the quads with the back supported.",
    tips: ["Keep the whole back flat against the pad", "Descend to at least 90 degrees at the knee", "Drive through the mid-foot"],
    mistakes: ["Letting the hips lift off the pad", "Bouncing at the bottom", "Very short partial reps"],
    alts: ["leg_press", "squat"]
  },
  leg_extension: {
    name: "Leg Extension", primary: "quads", muscle: "Quads", equipment: "machine",
    desc: "A machine isolation movement for the quadriceps.",
    tips: ["Extend through a full range of motion", "Pause and squeeze at the top", "Lower the weight under control"],
    mistakes: ["Kicking the weight up with momentum", "Using only a partial range", "Lifting the hips off the seat"],
    alts: ["leg_press", "goblet_squat"]
  },
  lunge: {
    name: "Walking Lunges", primary: "quads", muscle: "Quads / Glutes", equipment: "dumbbell",
    desc: "A unilateral lower-body movement that builds strength, balance and stability.",
    tips: ["Keep the torso upright", "Lower until both knees reach roughly 90 degrees", "Push through the front heel to stand"],
    mistakes: ["Letting the front knee cave inward", "Stride too short or too long", "Leaning excessively forward"],
    alts: ["bulgarian_split_squat", "leg_press"]
  },
  bulgarian_split_squat: {
    name: "Bulgarian Split Squat", primary: "quads", muscle: "Quads / Glutes", equipment: "dumbbell",
    desc: "A rear-foot-elevated single-leg squat. Brutally effective for legs with light loading.",
    tips: ["Set the rear foot on a bench at about knee height", "Keep most of the weight on the front leg", "Descend straight down, not forward"],
    mistakes: ["Standing too close to the bench", "Pushing off the back foot", "Letting the front knee collapse inward"],
    alts: ["lunge", "leg_press"]
  },

  /* ---------------- HAMSTRINGS / GLUTES ---------------- */
  rdl: {
    name: "Romanian Deadlift", primary: "hamstrings", muscle: "Hamstrings / Glutes", equipment: "barbell",
    desc: "A hip hinge that loads the hamstrings and glutes through a deep stretch.",
    tips: ["Keep a slight, fixed bend in the knees", "Push the hips back and keep the bar against your legs", "Maintain a flat back throughout"],
    mistakes: ["Rounding the lower back", "Bending the knees so much it becomes a squat", "Not pushing the hips back far enough"],
    alts: ["leg_curl", "deadlift", "hip_thrust"]
  },
  leg_curl: {
    name: "Leg Curl", primary: "hamstrings", muscle: "Hamstrings", equipment: "machine",
    desc: "A machine isolation movement for the hamstrings, seated or lying.",
    tips: ["Curl through a full range of motion", "Keep the hips down on the pad", "Control the weight on the way back"],
    mistakes: ["Swinging the weight with momentum", "Lifting the hips to cheat reps", "Stopping well short of full contraction"],
    alts: ["rdl"]
  },
  hip_thrust: {
    name: "Hip Thrust", primary: "glutes", muscle: "Glutes", equipment: "barbell",
    desc: "A loaded hip extension with the upper back braced on a bench. The strongest glute-focused movement.",
    tips: ["Drive through the heels", "Fully extend the hips and squeeze the glutes at the top", "Keep the chin tucked toward the chest"],
    mistakes: ["Hyperextending the lower back at the top", "Stopping short of full hip extension", "Placing the feet too far from the body"],
    alts: ["glute_bridge", "rdl"]
  },
  glute_bridge: {
    name: "Glute Bridge", primary: "glutes", muscle: "Glutes", equipment: "bodyweight",
    desc: "A floor-based hip extension. A good bodyweight substitute for the hip thrust.",
    tips: ["Push the hips up until the body forms a straight line", "Squeeze the glutes hard at the top", "Keep the ribs down, don't arch the back"],
    mistakes: ["Arching the lower back instead of extending the hips", "Pushing through the toes rather than heels", "Rushing the reps"],
    alts: ["hip_thrust"]
  },

  /* ---------------- CALVES ---------------- */
  calf_raise: {
    name: "Standing Calf Raise", primary: "calves", muscle: "Calves", equipment: "machine",
    desc: "The primary calf exercise, working the gastrocnemius through plantar flexion.",
    tips: ["Rise fully onto the balls of the feet", "Pause and squeeze at the top", "Lower slowly into a full stretch"],
    mistakes: ["Bouncing out of the bottom", "Using a tiny range of motion", "Rushing through the reps"],
    alts: ["seated_calf_raise"]
  },
  seated_calf_raise: {
    name: "Seated Calf Raise", primary: "calves", muscle: "Calves", equipment: "machine",
    desc: "A calf raise performed seated with the knee bent, biasing the soleus.",
    tips: ["Keep the knees bent at about 90 degrees", "Pause at the top of each rep", "Get a full stretch at the bottom"],
    mistakes: ["Bouncing the weight", "Half reps at the top", "Letting the heels drop uncontrolled"],
    alts: ["calf_raise"]
  },

  /* ---------------- ABS / CORE ---------------- */
  hanging_leg_raise: {
    name: "Hanging Leg Raise", primary: "abs", muscle: "Abs", equipment: "bodyweight",
    desc: "A core exercise hanging from a bar, raising the legs to work the abdominals and hip flexors.",
    tips: ["Curl the pelvis up rather than just swinging the legs", "Control the descent", "Minimise body swing"],
    mistakes: ["Using momentum to kick the legs up", "Only using the hip flexors, not the abs", "Arching the back at the bottom"],
    alts: ["cable_crunch", "plank"]
  },
  cable_crunch: {
    name: "Cable Crunch", primary: "abs", muscle: "Abs", equipment: "cable",
    desc: "A weighted, progressive core exercise performed kneeling in front of a cable stack.",
    tips: ["Curl the spine rather than hinging at the hips", "Keep the hips fixed in place", "Exhale hard as you crunch down"],
    mistakes: ["Hinging at the hips instead of flexing the spine", "Pulling with the arms rather than the abs", "Using momentum instead of a controlled squeeze"],
    alts: ["hanging_leg_raise", "plank"]
  },
  plank: {
    name: "Plank", primary: "abs", muscle: "Abs / Core", equipment: "bodyweight",
    desc: "An isometric hold that builds core stability and anti-extension strength.",
    tips: ["Keep the body in one straight line", "Squeeze the glutes and brace the abs", "Keep the neck neutral"],
    mistakes: ["Letting the hips sag", "Piking the hips too high", "Holding your breath instead of breathing steadily"],
    alts: ["cable_crunch", "hanging_leg_raise"]
  }
};

/**
 * Related muscle groups, used by smart exercise replacement when a
 * curated substitute list runs out. Keeps swaps training the same area.
 */
export const RELATED_MUSCLES = {
  chest: ["chest", "upper_chest"],
  upper_chest: ["upper_chest", "chest"],
  back: ["back", "lats"],
  lats: ["lats", "back"],
  traps: ["traps", "rear_delts"],
  rear_delts: ["rear_delts", "shoulders"],
  shoulders: ["shoulders", "rear_delts"],
  triceps: ["triceps"],
  biceps: ["biceps"],
  quads: ["quads"],
  hamstrings: ["hamstrings", "glutes"],
  glutes: ["glutes", "hamstrings"],
  calves: ["calves"],
  abs: ["abs"]
};

export const MUSCLE_LABELS = {
  chest: "Chest",
  upper_chest: "Upper Chest",
  back: "Back",
  lats: "Lats",
  traps: "Traps",
  rear_delts: "Rear Delts",
  shoulders: "Shoulders",
  triceps: "Triceps",
  biceps: "Biceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  abs: "Abs / Core"
};
