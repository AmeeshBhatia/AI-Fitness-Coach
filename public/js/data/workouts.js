/**
 * WORKOUT TEMPLATES
 *
 * DAY_TYPES  = the exercise prescription for one session type.
 *              Each row is [exerciseId, sets, reps]. Reps may be a
 *              string such as "45s" for timed holds.
 * SPLITS     = weekly schedules, Monday -> Sunday, referencing DAY_TYPES keys.
 *              Every schedule has exactly 7 entries and exactly N training days.
 */

export const WEEKDAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export const DAY_TYPES = {
  /* --- Push / Pull / Legs --- */
  Push: {
    label: "Push",
    exs: [
      ["bench", 4, "8"], ["incline_db", 3, "10"], ["ohp", 3, "10"],
      ["lateral_raise", 3, "15"], ["triceps_pushdown", 3, "12"], ["oh_triceps_ext", 3, "12"]
    ]
  },
  Pull: {
    label: "Pull",
    exs: [
      ["deadlift", 4, "6"], ["pullup", 3, "10"], ["row_bb", 3, "10"],
      ["face_pull", 3, "15"], ["bb_curl", 3, "10"], ["hammer_curl", 3, "12"]
    ]
  },
  Legs: {
    label: "Legs",
    exs: [
      ["squat", 4, "8"], ["rdl", 3, "10"], ["leg_press", 3, "12"],
      ["leg_curl", 3, "12"], ["calf_raise", 4, "15"], ["leg_extension", 3, "12"]
    ]
  },

  /* --- Upper / Lower --- */
  Upper: {
    label: "Upper Body",
    exs: [
      ["bench", 4, "8"], ["row_bb", 3, "10"], ["ohp", 3, "10"],
      ["lat_pulldown", 3, "10"], ["bb_curl", 3, "10"], ["triceps_pushdown", 3, "12"]
    ]
  },
  Lower: {
    label: "Lower Body",
    exs: [
      ["squat", 4, "8"], ["rdl", 3, "10"], ["leg_press", 3, "12"],
      ["leg_curl", 3, "12"], ["calf_raise", 4, "15"], ["hanging_leg_raise", 3, "15"]
    ]
  },

  /* --- Full body rotations --- */
  FB_A: {
    label: "Full Body A",
    exs: [
      ["squat", 4, "8"], ["bench", 3, "10"], ["row_bb", 3, "10"],
      ["ohp", 3, "10"], ["plank", 3, "45s"]
    ]
  },
  FB_B: {
    label: "Full Body B",
    exs: [
      ["deadlift", 4, "6"], ["incline_db", 3, "10"], ["pullup", 3, "10"],
      ["lateral_raise", 3, "15"], ["cable_crunch", 3, "15"]
    ]
  },
  FB_C: {
    label: "Full Body C",
    exs: [
      ["leg_press", 4, "10"], ["db_press", 3, "10"], ["row_db", 3, "10"],
      ["db_shoulder_press", 3, "10"], ["hanging_leg_raise", 3, "12"]
    ]
  },

  /* --- Bro split (one muscle group per day) --- */
  Chest: {
    label: "Chest",
    exs: [
      ["bench", 4, "8"], ["incline_bb", 3, "10"], ["cable_fly", 3, "12"],
      ["dips", 3, "10"], ["pushup", 3, "15"]
    ]
  },
  Back: {
    label: "Back",
    exs: [
      ["deadlift", 4, "6"], ["pullup", 4, "8"], ["row_bb", 3, "10"],
      ["lat_pulldown", 3, "10"], ["face_pull", 3, "15"]
    ]
  },
  Shoulders: {
    label: "Shoulders",
    exs: [
      ["ohp", 4, "8"], ["lateral_raise", 4, "15"], ["rear_delt_fly", 3, "15"],
      ["front_raise", 3, "12"], ["shrugs", 3, "12"]
    ]
  },
  Arms: {
    label: "Arms",
    exs: [
      ["bb_curl", 4, "10"], ["hammer_curl", 3, "12"], ["preacher_curl", 3, "12"],
      ["triceps_pushdown", 4, "12"], ["skull_crusher", 3, "10"], ["close_grip_bench", 3, "8"]
    ]
  },

  /* --- Combined days for lower-frequency schedules --- */
  Chest_Tri: {
    label: "Chest & Triceps",
    exs: [
      ["bench", 4, "8"], ["incline_bb", 3, "10"], ["cable_fly", 3, "12"],
      ["triceps_pushdown", 3, "12"], ["skull_crusher", 3, "10"]
    ]
  },
  Back_Bi: {
    label: "Back & Biceps",
    exs: [
      ["deadlift", 4, "6"], ["pullup", 4, "8"], ["row_bb", 3, "10"],
      ["bb_curl", 3, "10"], ["hammer_curl", 3, "12"]
    ]
  },
  Legs_Sho: {
    label: "Legs & Shoulders",
    exs: [
      ["squat", 4, "8"], ["rdl", 3, "10"], ["leg_press", 3, "12"],
      ["calf_raise", 3, "15"], ["ohp", 3, "10"], ["lateral_raise", 3, "15"]
    ]
  },
  ShoArms: {
    label: "Shoulders & Arms",
    exs: [
      ["ohp", 4, "8"], ["lateral_raise", 3, "15"], ["bb_curl", 3, "10"],
      ["triceps_pushdown", 3, "12"], ["hammer_curl", 3, "12"]
    ]
  },
  Core: {
    label: "Core & Conditioning",
    exs: [
      ["hanging_leg_raise", 3, "15"], ["plank", 3, "60s"],
      ["cable_crunch", 3, "15"], ["calf_raise", 4, "20"]
    ]
  },

  /* --- Arnold split (antagonist pairing) --- */
  ArnoldChestBack: {
    label: "Chest & Back",
    exs: [
      ["bench", 4, "8"], ["row_bb", 4, "8"], ["incline_db", 3, "10"],
      ["pullup", 3, "10"], ["cable_fly", 3, "12"]
    ]
  },
  ArnoldShoArms: {
    label: "Shoulders & Arms",
    exs: [
      ["ohp", 4, "8"], ["lateral_raise", 3, "15"], ["bb_curl", 3, "10"],
      ["triceps_pushdown", 3, "12"], ["hammer_curl", 3, "12"]
    ]
  },

  /* --- Rest --- */
  Rest: { label: "Rest", exs: [] }
};

export const SPLITS = {
  ppl: {
    label: "Push Pull Legs (PPL)",
    blurb: "Rotates pushing, pulling and leg days. Great balance of frequency and recovery.",
    schedules: {
      3: ["Push", "Rest", "Pull", "Rest", "Legs", "Rest", "Rest"],
      4: ["Push", "Pull", "Legs", "Rest", "Push", "Rest", "Rest"],
      5: ["Push", "Pull", "Legs", "Push", "Pull", "Rest", "Rest"],
      6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"]
    }
  },
  bro: {
    label: "Bro Split",
    blurb: "One muscle group per session. High volume per muscle, trained once a week.",
    schedules: {
      3: ["Chest_Tri", "Rest", "Back_Bi", "Rest", "Legs_Sho", "Rest", "Rest"],
      4: ["Chest", "Back", "Rest", "ShoArms", "Legs", "Rest", "Rest"],
      5: ["Chest", "Back", "Shoulders", "Arms", "Legs", "Rest", "Rest"],
      6: ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Rest"]
    }
  },
  upper_lower: {
    label: "Upper Lower",
    blurb: "Alternates upper and lower body. Simple, efficient and easy to recover from.",
    schedules: {
      3: ["Upper", "Rest", "Lower", "Rest", "Upper", "Rest", "Rest"],
      4: ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Rest"],
      5: ["Upper", "Lower", "Upper", "Lower", "Upper", "Rest", "Rest"],
      6: ["Upper", "Lower", "Upper", "Lower", "Upper", "Lower", "Rest"]
    }
  },
  full_body: {
    label: "Full Body",
    blurb: "Trains the whole body each session. Best for beginners and tight schedules.",
    schedules: {
      3: ["FB_A", "Rest", "FB_B", "Rest", "FB_C", "Rest", "Rest"],
      4: ["FB_A", "FB_B", "Rest", "FB_C", "FB_A", "Rest", "Rest"],
      5: ["FB_A", "FB_B", "FB_C", "FB_A", "FB_B", "Rest", "Rest"],
      6: ["FB_A", "FB_B", "FB_C", "FB_A", "FB_B", "FB_C", "Rest"]
    }
  },
  arnold: {
    label: "Arnold Split",
    blurb: "Pairs opposing muscle groups (chest with back). High volume, advanced.",
    schedules: {
      3: ["ArnoldChestBack", "Rest", "ArnoldShoArms", "Rest", "Legs", "Rest", "Rest"],
      4: ["ArnoldChestBack", "ArnoldShoArms", "Rest", "Legs", "ArnoldChestBack", "Rest", "Rest"],
      5: ["ArnoldChestBack", "ArnoldShoArms", "Legs", "ArnoldChestBack", "ArnoldShoArms", "Rest", "Rest"],
      6: ["ArnoldChestBack", "ArnoldShoArms", "Legs", "ArnoldChestBack", "ArnoldShoArms", "Legs", "Rest"]
    }
  }
};

export const TRAINING_DAY_OPTIONS = [3, 4, 5, 6];

/**
 * Rest interval heuristic: heavy compound work (4+ sets, low reps) gets
 * longer rest than higher-rep accessory work.
 */
export function restSeconds(sets, reps) {
  const repNum = parseInt(String(reps), 10);
  if (sets >= 4 && repNum <= 8) return 120;
  if (repNum <= 8) return 90;
  if (repNum <= 12) return 75;
  return 60;
}
