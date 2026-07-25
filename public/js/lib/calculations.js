/**
 * CALCULATION ENGINE
 *
 * Pure functions, no DOM access, so these are unit-testable in Node.
 * Formulas used:
 *   BMI  = weight(kg) / height(m)^2
 *   BMR  = Mifflin-St Jeor equation (current clinical standard)
 *   TDEE = BMR x activity multiplier
 */

import { getGoal, getActivityLevel } from "../data/goals.js";

export function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Overweight";
  return "Obese range";
}

/**
 * Mifflin-St Jeor. When gender is unspecified we use the midpoint of the
 * male (+5) and female (-161) constants, i.e. -78.
 */
export function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "male") return base + 5;
  if (gender === "female") return base - 161;
  return base - 78;
}

export function calcTDEE(bmr, activityId) {
  return bmr * getActivityLevel(activityId).multiplier;
}

/**
 * Target calories and macro split for a goal.
 * Protein is set per kg bodyweight, fat as a percentage of total
 * calories, and carbohydrate fills whatever calories remain.
 */
export function calcTargets(tdee, goalId, weightKg) {
  const goal = getGoal(goalId) || getGoal("stay_fit");

  // Never prescribe a dangerously low intake
  const target = Math.max(1200, Math.round(tdee + goal.calorieDelta));

  const protein = Math.round(goal.proteinPerKg * weightKg);
  const proteinKcal = protein * 4;

  const fatKcal = target * goal.fatPct;
  const fat = Math.round(fatKcal / 9);

  const carbKcal = Math.max(0, target - proteinKcal - fatKcal);
  const carbs = Math.round(carbKcal / 4);

  return { target, protein, carbs, fat };
}

/**
 * Runs the whole calculation chain for a profile.
 * Returns null when required inputs are missing (skipped onboarding).
 */
export function buildCalculations(profile, goalId) {
  if (!profile || !profile.height || !profile.weight || !profile.age) return null;

  const { height, weight, age, gender, activity } = profile;
  const bmi = calcBMI(weight, height);
  const bmr = calcBMR(weight, height, age, gender);
  const tdee = calcTDEE(bmr, activity);
  const targets = calcTargets(tdee, goalId, weight);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    ...targets
  };
}

/** Percentage of a macro's calories relative to total, for the macro bar. */
export function macroSplitPercentages({ protein, carbs, fat }) {
  const pKcal = protein * 4;
  const cKcal = carbs * 4;
  const fKcal = fat * 9;
  const total = pKcal + cKcal + fKcal || 1;
  return {
    protein: Math.round((pKcal / total) * 100),
    carbs: Math.round((cKcal / total) * 100),
    fat: Math.round((fKcal / total) * 100)
  };
}
