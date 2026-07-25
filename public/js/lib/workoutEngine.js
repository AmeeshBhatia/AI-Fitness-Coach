/**
 * WORKOUT ENGINE
 *
 * Builds weekly plans from the split templates and handles regeneration
 * plus smart exercise replacement. Pure logic, no DOM access.
 */

import { EXERCISES, RELATED_MUSCLES } from "../data/exercises.js";
import { DAY_TYPES, SPLITS, WEEKDAYS, restSeconds } from "../data/workouts.js";

/**
 * All valid substitutes for an exercise, best-first:
 *   1. curated direct substitutes (same movement pattern)
 *   2. other exercises hitting the same or a closely related muscle
 */
export function getAlternatives(exerciseId) {
  const ex = EXERCISES[exerciseId];
  if (!ex) return [];

  const curated = (ex.alts || []).filter((id) => EXERCISES[id]);
  const related = RELATED_MUSCLES[ex.primary] || [ex.primary];

  const sameMuscle = Object.keys(EXERCISES).filter(
    (id) => id !== exerciseId && related.includes(EXERCISES[id].primary) && !curated.includes(id)
  );

  return [...curated, ...sameMuscle];
}

/** Build the 7-day plan for the chosen split and training frequency. */
export function generateWorkoutPlan(splitKey, days) {
  const split = SPLITS[splitKey];
  if (!split) throw new Error(`Unknown split: ${splitKey}`);

  const schedule = split.schedules[days];
  if (!schedule) throw new Error(`No ${days}-day schedule for split: ${splitKey}`);

  const plan = {};
  schedule.forEach((dayTypeKey, idx) => {
    plan[WEEKDAYS[idx]] = buildDay(dayTypeKey);
  });

  return { schedule, plan };
}

function buildDay(dayTypeKey) {
  const dayType = DAY_TYPES[dayTypeKey];
  if (!dayType) throw new Error(`Unknown day type: ${dayTypeKey}`);

  return {
    typeKey: dayTypeKey,
    typeLabel: dayType.label,
    exercises: dayType.exs.map(([id, sets, reps], i) => ({
      id,
      sets,
      reps,
      rest: restSeconds(sets, reps),
      order: i + 1
    }))
  };
}

/**
 * Regenerate a day: keeps the same sets/reps prescription and muscle
 * targets but picks different exercises where valid options exist.
 */
export function regenerateDay(day) {
  if (!day || day.typeKey === "Rest") return day;

  const template = DAY_TYPES[day.typeKey];
  const used = new Set();

  const exercises = template.exs.map(([templateId, sets, reps], i) => {
    const pool = [templateId, ...getAlternatives(templateId)].filter(
      (id) => !used.has(id)
    );
    const currentId = day.exercises[i] ? day.exercises[i].id : templateId;

    // Prefer something different from what's currently shown
    const candidates = pool.filter((id) => id !== currentId);
    const chosen = candidates.length
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : pool[0] || templateId;

    used.add(chosen);
    return { id: chosen, sets, reps, rest: restSeconds(sets, reps), order: i + 1 };
  });

  return { ...day, exercises };
}

/**
 * Replace one exercise, cycling through valid alternatives so repeated
 * taps keep offering something new. Skips exercises already in the day.
 */
export function replaceExercise(day, index) {
  const current = day.exercises[index];
  if (!current) return day;

  const inUse = day.exercises.filter((_, i) => i !== index).map((e) => e.id);
  const options = getAlternatives(current.id).filter((id) => !inUse.includes(id));

  if (options.length === 0) return day; // nothing valid to swap to

  const cycle = [current.id, ...options];
  const nextId = cycle[(cycle.indexOf(current.id) + 1) % cycle.length];

  const exercises = day.exercises.slice();
  exercises[index] = { ...current, id: nextId };
  return { ...day, exercises };
}

/** Percentage of this week's training days marked complete. */
export function completionPercentage(plan, completed = {}) {
  if (!plan) return 0;

  const trainingDays = WEEKDAYS.filter((d) => plan[d] && plan[d].typeKey !== "Rest");
  if (trainingDays.length === 0) return 0;

  const done = trainingDays.filter((d) => completed[d]).length;
  return Math.round((done / trainingDays.length) * 100);
}

/** Total working sets in a day, useful for the dashboard summary. */
export function totalSets(day) {
  if (!day || !day.exercises) return 0;
  return day.exercises.reduce((sum, e) => sum + Number(e.sets), 0);
}

/** Estimated session duration in minutes from sets and rest intervals. */
export function estimatedDuration(day) {
  if (!day || !day.exercises || day.exercises.length === 0) return 0;
  const seconds = day.exercises.reduce((sum, e) => {
    const working = Number(e.sets) * 45; // ~45s under tension per set
    const resting = (Number(e.sets) - 1) * e.rest;
    return sum + working + resting;
  }, 0);
  return Math.round(seconds / 60);
}

/** Today's weekday name, with Monday as index 0 to match WEEKDAYS. */
export function todayName(date = new Date()) {
  return WEEKDAYS[(date.getDay() + 6) % 7];
}
