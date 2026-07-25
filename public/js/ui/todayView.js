/**
 * TODAY VIEW (dashboard)
 * Today's session, today's nutrition targets and a week-at-a-glance summary.
 */

import { state, saveState } from "../lib/store.js";
import { EXERCISES } from "../data/exercises.js";
import { WEEKDAYS } from "../data/workouts.js";
import { SLOT_LABELS } from "../data/meals.js";
import {
  todayName, totalSets, estimatedDuration, completionPercentage
} from "../lib/workoutEngine.js";
import { $, esc, setHTML } from "./dom.js";
import { registerScreen, goTo } from "./router.js";
import { setActiveDay } from "./workoutView.js";

export function renderToday() {
  const today = todayName();
  const plan = state.workout.plan;
  if (!plan) return;

  const day = plan[today];
  const isRest = day.typeKey === "Rest";
  const isDone = Boolean(state.workout.completed[today]);
  const pct = completionPercentage(plan, state.workout.completed);

  const dietIndex = WEEKDAYS.indexOf(today);
  const dietDay = state.diet.plan ? state.diet.plan[dietIndex] : null;

  setHTML("screen-today", `
    ${heroBlock(today, day, isRest, isDone)}
    ${isRest ? "" : sessionBlock(day)}
    ${dietDay ? nutritionBlock(dietDay) : noDietBlock()}
    ${weekBlock(plan, pct)}
  `);

  wireButtons(today, isRest, isDone);
}

function heroBlock(today, day, isRest, isDone) {
  const sets = totalSets(day);
  const mins = estimatedDuration(day);
  const meta = isRest
    ? "Recovery day — no session scheduled"
    : `${day.exercises.length} exercises · ${sets} sets · about ${mins} min`;

  return `<div class="today-hero">
    <div class="eyebrow">${esc(today)}</div>
    <h3>${esc(isRest ? "Rest Day" : day.typeLabel)}</h3>
    <div class="meta">${esc(meta)}</div>
    ${isRest ? "" : `<button class="btn ${isDone ? "btn-secondary" : ""}" id="btnTodayDone" type="button">
        ${isDone ? "✓ Completed today" : "Mark Today Complete"}
      </button>`}
  </div>`;
}

function sessionBlock(day) {
  const rows = day.exercises.map((ex) => {
    const info = EXERCISES[ex.id];
    return `<div class="mini-row">
      <span>${esc(info.name)}</span>
      <span>${ex.sets} × ${esc(ex.reps)}</span>
    </div>`;
  }).join("");

  return `<div class="card">
    <h3>Today's session</h3>
    <div class="mini-list">${rows}</div>
    <button class="btn btn-secondary" id="btnOpenWorkout" type="button">Open Full Workout</button>
  </div>`;
}

function nutritionBlock(dietDay) {
  const rows = dietDay.meals.map((m) => `
    <div class="mini-row">
      <span>${esc(SLOT_LABELS[m.slot])}: ${esc(m.name)}</span>
      <span>${m.kcal} kcal</span>
    </div>`).join("");

  return `<div class="card">
    <h3>Today's nutrition</h3>
    <div class="stat-grid-4">
      <div class="stat"><div class="stat-val">${dietDay.totals.kcal}</div><div class="stat-lab">Calories</div></div>
      <div class="stat"><div class="stat-val">${dietDay.totals.p}g</div><div class="stat-lab">Protein</div></div>
      <div class="stat"><div class="stat-val">${dietDay.totals.c}g</div><div class="stat-lab">Carbs</div></div>
      <div class="stat"><div class="stat-val">${dietDay.totals.f}g</div><div class="stat-lab">Fat</div></div>
    </div>
    <div class="mini-list">${rows}</div>
    <button class="btn btn-secondary" id="btnOpenDiet" type="button">Open Meal Plan</button>
  </div>`;
}

function noDietBlock() {
  return `<div class="card">
    <h3>Nutrition</h3>
    <p class="lead" style="margin-bottom:0;">
      No meal plan set up. Add your details to get calorie targets and a 7-day plan.
    </p>
    <button class="btn btn-secondary" id="btnOpenDiet" type="button">Set Up Meal Plan</button>
  </div>`;
}

function weekBlock(plan, pct) {
  const rows = WEEKDAYS.map((d) => {
    const dayData = plan[d];
    const rest = dayData.typeKey === "Rest";
    const done = Boolean(state.workout.completed[d]);
    const status = rest ? "Rest" : done ? "✓ Done" : "Scheduled";
    return `<div class="mini-row">
      <span style="${rest ? "color:var(--muted)" : ""}">${esc(d)} · ${esc(dayData.typeLabel)}</span>
      <span style="${done ? "color:var(--accent)" : ""}">${esc(status)}</span>
    </div>`;
  }).join("");

  return `<div class="card">
    <h3>This week</h3>
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    <p class="note">${pct}% of scheduled sessions complete</p>
    <div class="mini-list">${rows}</div>
  </div>`;
}

function wireButtons(today, isRest, isDone) {
  const doneBtn = $("btnTodayDone");
  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      state.workout.completed[today] = !isDone;
      saveState();
      renderToday();
    });
  }

  const workoutBtn = $("btnOpenWorkout");
  if (workoutBtn) {
    workoutBtn.addEventListener("click", () => {
      setActiveDay(today);
      goTo("screen-workout");
    });
  }

  const dietBtn = $("btnOpenDiet");
  if (dietBtn) dietBtn.addEventListener("click", () => goTo("screen-diet"));
}

export function initTodayView() {
  registerScreen("screen-today", renderToday);
}
