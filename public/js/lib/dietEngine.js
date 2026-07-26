/**
 * DIET ENGINE
 *
 * Builds a 7-day meal plan for a diet type, scaling portion sizes so each
 * day lands close to the user's calorie target. Pure logic, no DOM access.
 */

import { MEALS, SLOTS, NONVEG_DISHES, nonVegSlotForDay } from "../data/meals.js";

const DEFAULT_TARGET_CALORIES = 2200;

// Portion scaling bounds — keeps servings realistic rather than
// prescribing a triple helping of curry to hit a calorie number.
const MIN_SCALE = 0.7;
const MAX_SCALE = 1.75;

// When portion scaling alone can't reach a high calorie target, top the day
// up with extra snacks instead of inflating meals to absurd sizes. This is
// how higher-calorie diets actually work in practice.
const TOPUP_THRESHOLD = 200; // only top up if still short by more than this
const MAX_TOPUPS = 3;

/**
 * Choose a meal for a given day and slot. The offset rotates selections so
 * consecutive days differ, and regeneration passes a new offset for variety.
 */
function pickMeal(dietType, slot, dayIndex, offset) {
  const options = MEALS[dietType][slot];
  const slotIndex = SLOTS.indexOf(slot);
  const idx = (dayIndex + slotIndex + offset) % options.length;
  return options[idx];
}

function scaleMeal(meal, scale) {
  return {
    slot: meal.slot,
    name: meal.name,
    kcal: Math.round(meal.kcal * scale),
    p: Math.round(meal.p * scale),
    c: Math.round(meal.c * scale),
    f: Math.round(meal.f * scale),
    // Preserve the flag so the UI can badge the day's non-veg meal
    ...(meal.nonveg ? { nonveg: true } : {})
  };
}

/**
 * Swap exactly one meal of the day for a non-veg dish. Mutates `meals`.
 * The slot alternates between dinner and lunch across the week, so a
 * non-veg plan is a vegetarian day plus a single non-veg meal.
 */
function applyNonVegMeal(meals, day, offset) {
  const slot = nonVegSlotForDay(day);
  const options = NONVEG_DISHES[slot];
  const dish = options[(day + offset) % options.length];

  const index = meals.findIndex((m) => m.slot === slot);
  if (index !== -1) meals[index] = { ...dish, slot };
}

function sumTotals(meals) {
  return meals.reduce(
    (t, m) => ({ kcal: t.kcal + m.kcal, p: t.p + m.p, c: t.c + m.c, f: t.f + m.f }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}

/**
 * Generate the full 7-day plan.
 *
 * @param {string} dietType      "veg" | "nonveg" | "vegan"
 * @param {number} targetCalories daily calorie target
 * @param {number} offset         rotation seed; change it to regenerate
 */
export function generateDietPlan(dietType, targetCalories, offset = 0) {
  if (!MEALS[dietType]) throw new Error(`Unknown diet type: ${dietType}`);

  const target = targetCalories || DEFAULT_TARGET_CALORIES;
  const plan = {};

  for (let day = 0; day < 7; day++) {
    const base = SLOTS.map((slot) => ({ slot, ...pickMeal(dietType, slot, day, offset) }));

    // The non-veg plan is a vegetarian day with exactly one meal swapped out
    if (dietType === "nonveg") applyNonVegMeal(base, day, offset);

    const baseCalories = base.reduce((s, m) => s + m.kcal, 0);
    const rawScale = target / baseCalories;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, rawScale));

    const meals = base.map((m) => scaleMeal(m, scale));
    addTopUps(meals, dietType, target, day, offset);

    plan[day] = { meals, totals: sumTotals(meals) };
  }

  return plan;
}

/**
 * Close a remaining calorie gap by appending extra snacks. Mutates `meals`.
 * Used when the daily target is high enough that portion scaling alone
 * (capped at MAX_SCALE) can't get there.
 */
function addTopUps(meals, dietType, target, day, offset) {
  const snackPool = MEALS[dietType].snack;

  for (let i = 0; i < MAX_TOPUPS; i++) {
    const gap = target - sumTotals(meals).kcal;
    if (gap <= TOPUP_THRESHOLD) return;

    const snack = snackPool[(day + offset + i + 1) % snackPool.length];
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, gap / snack.kcal));

    meals.push({ ...scaleMeal({ ...snack, slot: "extra" }, scale), slot: "extra" });
  }
}

/** Average daily calories and macros across the week. */
export function weeklyAverages(plan) {
  const days = Object.values(plan);
  if (days.length === 0) return { kcal: 0, p: 0, c: 0, f: 0 };

  const sum = days.reduce(
    (t, d) => ({
      kcal: t.kcal + d.totals.kcal,
      p: t.p + d.totals.p,
      c: t.c + d.totals.c,
      f: t.f + d.totals.f
    }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  return {
    kcal: Math.round(sum.kcal / days.length),
    p: Math.round(sum.p / days.length),
    c: Math.round(sum.c / days.length),
    f: Math.round(sum.f / days.length)
  };
}
