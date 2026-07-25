/**
 * ONBOARDING & SETUP FLOW
 * Personal details -> goal -> results -> split -> days -> diet -> app
 */

import { state, saveState } from "../lib/store.js";
import { buildCalculations, macroSplitPercentages } from "../lib/calculations.js";
import { generateWorkoutPlan } from "../lib/workoutEngine.js";
import { generateDietPlan } from "../lib/dietEngine.js";
import { GOALS, ACTIVITY_LEVELS, getActivityLevel } from "../data/goals.js";
import { SPLITS, TRAINING_DAY_OPTIONS, DAY_TYPES, WEEKDAYS } from "../data/workouts.js";
import { DIET_TYPES } from "../data/meals.js";
import { $, esc, setText, setHTML, showError, clearError, renderOptions } from "./dom.js";
import { goTo, registerScreen, showAppChrome } from "./router.js";

let onEnterApp = () => {};

/* ---------------- Screen: personal details ---------------- */

function renderActivitySelect() {
  const select = $("inActivity");
  if (!select) return;

  select.innerHTML = ACTIVITY_LEVELS
    .map((a) => `<option value="${a.id}">${esc(a.label)}</option>`)
    .join("");

  select.value = (state.profile && state.profile.activity) || "moderate";
  updateActivityHint();
  select.onchange = updateActivityHint;
}

function updateActivityHint() {
  const select = $("inActivity");
  if (!select) return;
  const level = getActivityLevel(select.value);
  setText("activityHint", `${level.blurb} (x${level.multiplier} multiplier)`);
}

function renderPersonal() {
  renderActivitySelect();
  clearError("personalError");

  if (state.profile) {
    $("inHeight").value = state.profile.height ?? "";
    $("inWeight").value = state.profile.weight ?? "";
    $("inAge").value = state.profile.age ?? "";
    $("inGender").value = state.profile.gender ?? "";
  }
}

function submitPersonal() {
  const height = parseFloat($("inHeight").value);
  const weight = parseFloat($("inWeight").value);
  const age = parseInt($("inAge").value, 10);
  const gender = $("inGender").value;
  const activity = $("inActivity").value;

  if (!height || !weight || !age) {
    return showError("personalError", "Please fill in your height, weight and age.");
  }
  if (height < 120 || height > 230) {
    return showError("personalError", "Please enter a height between 120 and 230 cm.");
  }
  if (weight < 35 || weight > 250) {
    return showError("personalError", "Please enter a weight between 35 and 250 kg.");
  }
  if (age < 14 || age > 100) {
    return showError("personalError", "Please enter an age between 14 and 100.");
  }

  clearError("personalError");
  state.profile = { height, weight, age, gender, activity };
  state.onboardingSkipped = false;
  saveState();
  goTo("screen-goal");
}

/* ---------------- Screen: goal ---------------- */

function renderGoal() {
  clearError("goalError");
  renderOptions("goalOptions", GOALS, state.goal, (id) => {
    state.goal = id;
    renderGoal();
  });
}

function submitGoal() {
  if (!state.goal) return showError("goalError", "Please choose a fitness goal.");

  clearError("goalError");
  state.calc = buildCalculations(state.profile, state.goal);
  saveState();
  goTo("screen-results");
}

/* ---------------- Screen: results ---------------- */

function renderResults() {
  const c = state.calc;
  if (!c) return;

  setText("resBmi", c.bmi);
  setText("resTdee", c.tdee);
  setText("resTarget", c.target);
  setText(
    "resNote",
    `BMI category: ${c.bmiCategory}. Your maintenance is about ${c.tdee} kcal/day, ` +
    `so your goal sets a target of ${c.target} kcal/day.`
  );

  const pct = macroSplitPercentages(c);
  setHTML("macroBar",
    `<span style="width:${pct.protein}%;background:var(--accent)"></span>` +
    `<span style="width:${pct.carbs}%;background:var(--blue)"></span>` +
    `<span style="width:${pct.fat}%;background:var(--amber)"></span>`
  );

  setText("resProtein", `${c.protein}g`);
  setText("resCarbs", `${c.carbs}g`);
  setText("resFat", `${c.fat}g`);
}

/* ---------------- Screen: split ---------------- */

function renderSplit() {
  clearError("splitError");
  const items = Object.entries(SPLITS).map(([id, s]) => ({
    id, label: s.label, blurb: s.blurb
  }));
  renderOptions("splitOptions", items, state.workout.split, (id) => {
    state.workout.split = id;
    renderSplit();
  });
}

function submitSplit() {
  if (!state.workout.split) {
    return showError("splitError", "Please choose a workout split.");
  }
  clearError("splitError");
  saveState();
  goTo("screen-days");
}

/* ---------------- Screen: training days ---------------- */

function renderDays() {
  clearError("daysError");

  const items = TRAINING_DAY_OPTIONS.map((n) => ({ id: n, label: `${n} Days` }));
  renderOptions("daysOptions", items, state.workout.days, (id) => {
    state.workout.days = id;
    renderDays();
  }, { center: true });

  renderSchedulePreview();
}

function renderSchedulePreview() {
  const preview = $("schedulePreview");
  if (!preview) return;

  const { split, days } = state.workout;
  if (!split || !days) {
    preview.hidden = true;
    return;
  }

  const schedule = SPLITS[split].schedules[days];
  preview.hidden = false;

  setHTML("schedulePreviewBody", schedule.map((typeKey, i) => {
    const label = DAY_TYPES[typeKey].label;
    const isRest = typeKey === "Rest";
    return `<div class="mini-row">
      <span>${esc(WEEKDAYS[i])}</span>
      <span style="${isRest ? "" : "color:var(--accent)"}">${esc(label)}</span>
    </div>`;
  }).join(""));
}

function submitDays() {
  if (!state.workout.days) {
    return showError("daysError", "Please choose how many days a week you'll train.");
  }
  clearError("daysError");

  const { schedule, plan } = generateWorkoutPlan(state.workout.split, state.workout.days);
  state.workout.schedule = schedule;
  state.workout.plan = plan;
  state.workout.completed = state.workout.completed || {};
  saveState();

  // Workout-only mode skips the diet planner entirely
  if (state.onboardingSkipped) {
    state.onboardingComplete = true;
    saveState();
    return onEnterApp();
  }

  // Changing split later shouldn't force the user back through diet setup
  if (state.onboardingComplete && state.diet.plan) {
    return onEnterApp();
  }

  goTo("screen-diet-setup");
}

/* ---------------- Screen: diet type ---------------- */

function renderDietSetup() {
  clearError("dietError");
  renderOptions("dietOptions", DIET_TYPES, state.diet.type, (id) => {
    state.diet.type = id;
    renderDietSetup();
  });
}

function submitDietType() {
  if (!state.diet.type) {
    return showError("dietError", "Please choose a diet preference.");
  }
  clearError("dietError");

  const targetCalories = state.calc ? state.calc.target : 2200;
  const targetProtein = state.calc ? state.calc.protein : 130;

  state.diet.targetCalories = targetCalories;
  state.diet.targetProtein = targetProtein;
  state.diet.offset = 0;
  state.diet.plan = generateDietPlan(state.diet.type, targetCalories, 0);

  state.onboardingComplete = true;
  saveState();
  onEnterApp();
}

/* ---------------- Skip path ---------------- */

function skipOnboarding() {
  state.onboardingSkipped = true;
  state.profile = null;
  state.goal = null;
  state.calc = null;
  state.diet = { type: null, offset: 0, targetCalories: null, targetProtein: null, plan: null };
  saveState();
  goTo("screen-split");
}

/* ---------------- Public API ---------------- */

export function initOnboarding({ enterApp }) {
  onEnterApp = enterApp;

  // Register renderers so goTo() always paints before showing a screen
  registerScreen("screen-personal", renderPersonal);
  registerScreen("screen-goal", renderGoal);
  registerScreen("screen-results", renderResults);
  registerScreen("screen-split", renderSplit);
  registerScreen("screen-days", renderDays);
  registerScreen("screen-diet-setup", renderDietSetup);

  $("btnStart").addEventListener("click", () => {
    showAppChrome(false);
    goTo("screen-personal");
  });
  $("btnSkipOnboarding").addEventListener("click", () => {
    showAppChrome(false);
    skipOnboarding();
  });

  $("btnPersonalNext").addEventListener("click", submitPersonal);
  $("btnGoalNext").addEventListener("click", submitGoal);
  $("btnResultsNext").addEventListener("click", () => goTo("screen-split"));
  $("btnSplitNext").addEventListener("click", submitSplit);
  $("btnDaysNext").addEventListener("click", submitDays);
  $("btnDietNext").addEventListener("click", submitDietType);

  // Enter key submits the personal details form
  $("formPersonal").addEventListener("submit", (e) => {
    e.preventDefault();
    submitPersonal();
  });
}

/** Restart the flow from the welcome screen (used by Settings). */
export function restartOnboarding() {
  showAppChrome(false);
  goTo("screen-welcome");
}

/** Jump straight to the diet chooser (used by Settings). */
export function editDietPreference() {
  goTo("screen-diet-setup");
}

/** Jump straight to the split chooser (used by the Workout screen). */
export function editSplit() {
  goTo("screen-split");
}
