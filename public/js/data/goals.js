/**
 * GOALS & ACTIVITY LEVELS
 *
 * calorieDelta   adjustment applied to maintenance calories (TDEE)
 * proteinPerKg   daily protein target per kg of bodyweight
 * fatPct         share of total calories from fat (carbs fill the remainder)
 */

export const GOALS = [
  {
    id: "lose_fat",
    label: "Lose Fat",
    blurb: "Calorie deficit with high protein to preserve muscle",
    calorieDelta: -500,
    proteinPerKg: 2.0,
    fatPct: 0.25
  },
  {
    id: "build_muscle",
    label: "Build Muscle",
    blurb: "Moderate calorie surplus with high protein",
    calorieDelta: 300,
    proteinPerKg: 1.8,
    fatPct: 0.25
  },
  {
    id: "recomposition",
    label: "Body Recomposition",
    blurb: "Near maintenance calories, very high protein",
    calorieDelta: -100,
    proteinPerKg: 2.0,
    fatPct: 0.25
  },
  {
    id: "strength",
    label: "Increase Strength",
    blurb: "Slight surplus to fuel heavy performance",
    calorieDelta: 200,
    proteinPerKg: 1.8,
    fatPct: 0.28
  },
  {
    id: "stay_fit",
    label: "Stay Fit",
    blurb: "Maintenance calories with balanced macros",
    calorieDelta: 0,
    proteinPerKg: 1.6,
    fatPct: 0.30
  }
];

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", blurb: "Desk job, little movement outside training", multiplier: 1.2 },
  { id: "light", label: "Lightly Active", blurb: "Light walking, on your feet some of the day", multiplier: 1.375 },
  { id: "moderate", label: "Moderately Active", blurb: "Regular training, reasonably active day", multiplier: 1.55 },
  { id: "very", label: "Very Active", blurb: "Hard training plus a physical job", multiplier: 1.725 }
];

export function getGoal(id) {
  return GOALS.find((g) => g.id === id) || null;
}

export function getActivityLevel(id) {
  return ACTIVITY_LEVELS.find((a) => a.id === id) || ACTIVITY_LEVELS[2];
}
