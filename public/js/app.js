/**
 * APP ENTRY POINT
 * Wires the modules together, restores saved state and boots the UI.
 */

import { state, loadState, saveState, resetState, hasPlan } from "./lib/store.js";
import { SPLITS } from "./data/workouts.js";
import { GOALS } from "./data/goals.js";
import { DIET_TYPES } from "./data/meals.js";

import { $, esc, setText, setHTML, initModals, openModal, closeModal } from "./ui/dom.js";
import { initRouter, goTo, showAppChrome } from "./ui/router.js";
import { initOnboarding, restartOnboarding, editDietPreference, editSplit } from "./ui/onboarding.js";
import { initTodayView } from "./ui/todayView.js";
import { initWorkoutView } from "./ui/workoutView.js";
import { initDietView } from "./ui/dietView.js";
import { initProgressView } from "./ui/progressView.js";
import { initLibraryView } from "./ui/libraryView.js";

/** Switch from onboarding into the main tabbed app. */
function enterApp() {
  showAppChrome(true);
  updateTopbar();
  goTo("screen-today");
  saveState();
}

function updateTopbar() {
  setText("topbarTitle", "Fitness Coach");

  if (state.onboardingSkipped || !state.calc) {
    const split = state.workout.split ? SPLITS[state.workout.split].label : "";
    setText("topbarSub", split ? `${split} · workout-only mode` : "Workout-only mode");
    return;
  }

  const goal = GOALS.find((g) => g.id === state.goal);
  setText("topbarSub", `${goal ? goal.label : "Your plan"} · ${state.calc.target} kcal/day`);
}

/* ---------------- Settings ---------------- */

function renderSettingsSummary() {
  const rows = [];

  if (state.profile) {
    rows.push(["Height", `${state.profile.height} cm`]);
    rows.push(["Weight", `${state.profile.weight} kg`]);
    rows.push(["Age", state.profile.age]);
  }
  if (state.goal) {
    const goal = GOALS.find((g) => g.id === state.goal);
    if (goal) rows.push(["Goal", goal.label]);
  }
  if (state.calc) {
    rows.push(["Target calories", `${state.calc.target} kcal`]);
    rows.push(["Protein target", `${state.calc.protein} g`]);
  }
  if (state.workout.split) {
    rows.push(["Split", `${SPLITS[state.workout.split].label} (${state.workout.days} days)`]);
  }
  if (state.diet.type) {
    const diet = DIET_TYPES.find((d) => d.id === state.diet.type);
    if (diet) rows.push(["Diet", diet.label]);
  }
  rows.push(["Progress logs", state.progress.length]);

  setHTML("settingsSummary", `<div class="card"><div class="mini-list">${
    rows.map(([k, v]) => `<div class="mini-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("")
  }</div></div>`);
}

function initSettings() {
  $("btnSettings").addEventListener("click", () => {
    renderSettingsSummary();
    openModal("settingsModal");
  });

  $("btnRedoOnboarding").addEventListener("click", () => {
    closeModal("settingsModal");
    restartOnboarding();
  });

  $("btnChangeDiet").addEventListener("click", () => {
    closeModal("settingsModal");
    editDietPreference();
  });

  $("btnResetAll").addEventListener("click", () => {
    const ok = confirm("This erases your plan and all logged progress on this device. Continue?");
    if (!ok) return;
    resetState();
    closeModal("settingsModal");
    showAppChrome(false);
    goTo("screen-welcome");
  });
}

/* ---------------- Boot ---------------- */

function boot() {
  initModals();
  initRouter();
  initSettings();

  initOnboarding({ enterApp });
  initTodayView();
  initWorkoutView({ onChangeSplit: editSplit });
  initDietView({ setupDiet: editDietPreference });
  initProgressView();
  initLibraryView();

  const restored = loadState();

  if (restored && hasPlan()) {
    enterApp();
  } else {
    showAppChrome(false);
    goTo("screen-welcome");
  }

  // Surface the app version in the console for debugging
  console.log("AI Fitness Coach ready.", hasPlan() ? "Plan restored." : "No saved plan.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
