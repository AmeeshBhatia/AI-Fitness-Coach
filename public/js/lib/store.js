/**
 * APPLICATION STORE
 *
 * Single source of truth for app state, persisted to localStorage so the
 * user's plan survives page reloads and browser restarts.
 */

const STORAGE_KEY = "aiFitnessCoach.state.v2";

export function defaultState() {
  return {
    onboardingComplete: false,
    onboardingSkipped: false,

    // { height, weight, age, gender, activity }
    profile: null,
    goal: null,

    // Output of buildCalculations()
    calc: null,

    workout: {
      split: null,
      days: null,
      schedule: null,
      plan: null,
      completed: {} // { Monday: true, ... }
    },

    diet: {
      type: null,
      offset: 0,
      targetCalories: null,
      targetProtein: null,
      plan: null
    },

    // [{ date, weight, bmi, photoNote }]
    progress: []
  };
}

export const state = defaultState();

function hasStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function saveState() {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Could not save state:", err);
  }
}

/** Returns true if a previous session was restored. */
export function loadState() {
  if (!hasStorage()) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const saved = JSON.parse(raw);
    const fresh = defaultState();

    // Merge defensively so older saved payloads missing newer keys
    // don't leave the app with undefined branches.
    Object.assign(state, fresh, saved, {
      workout: { ...fresh.workout, ...(saved.workout || {}) },
      diet: { ...fresh.diet, ...(saved.diet || {}) },
      progress: Array.isArray(saved.progress) ? saved.progress : []
    });

    // Guard against a saved payload carrying an explicit undefined
    if (!state.workout.completed) state.workout.completed = {};

    return true;
  } catch (err) {
    console.warn("Could not load saved state:", err);
    return false;
  }
}

export function resetState() {
  Object.assign(state, defaultState());
  if (hasStorage()) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** True once the user has a usable workout plan. */
export function hasPlan() {
  return Boolean(state.workout && state.workout.plan);
}
