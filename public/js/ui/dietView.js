/**
 * DIET VIEW
 * 7-day meal plan with per-meal macros, daily totals and regeneration.
 */

import { state, saveState } from "../lib/store.js";
import { SLOT_LABELS, DIET_TYPES } from "../data/meals.js";
import { WEEKDAYS } from "../data/workouts.js";
import { generateDietPlan, weeklyAverages } from "../lib/dietEngine.js";
import { $, esc, setText, setHTML, button } from "./dom.js";
import { registerScreen } from "./router.js";

let activeDayIndex = 0;
let onSetupDiet = () => {};

function dietLabel(id) {
  const found = DIET_TYPES.find((d) => d.id === id);
  return found ? found.label : "";
}

export function renderDiet() {
  const plan = state.diet.plan;

  if (!plan) {
    setText("dietTypeLabel", "No meal plan yet");
    $("dietDayTabs").innerHTML = "";
    setHTML("dietDayBody", `<div class="empty">
      <strong>No meal plan yet</strong><br />
      You skipped the diet setup. Add your details and preference to generate a 7-day plan.
      <button class="btn" id="btnSetupDiet" type="button" style="margin-top:14px;">Set Up Meal Plan</button>
    </div>`);
    const btn = $("btnSetupDiet");
    if (btn) btn.addEventListener("click", onSetupDiet);
    return;
  }

  const avg = weeklyAverages(plan);
  setText(
    "dietTypeLabel",
    `${dietLabel(state.diet.type)} · Target ${state.diet.targetCalories} kcal · ` +
    `Weekly avg ${avg.kcal} kcal / ${avg.p}g protein`
  );

  renderTabs();
  renderDayBody();
}

function renderTabs() {
  const container = $("dietDayTabs");
  container.innerHTML = "";

  WEEKDAYS.forEach((day, index) => {
    container.appendChild(button({
      className: index === activeDayIndex ? "is-active" : "",
      text: day.slice(0, 3),
      attrs: { "aria-label": day },
      onClick: () => {
        activeDayIndex = index;
        renderTabs();
        renderDayBody();
      }
    }));
  });
}

function renderDayBody() {
  const dayData = state.diet.plan[activeDayIndex];
  const targetCals = state.diet.targetCalories || 0;
  const diff = dayData.totals.kcal - targetCals;
  const diffLabel = diff === 0
    ? "on target"
    : `${diff > 0 ? "+" : ""}${diff} kcal vs target`;

  const meals = dayData.meals.map((m) => `
    <div class="card tight meal-card">
      <span class="pill">${esc(SLOT_LABELS[m.slot])}</span>
      <h4>${esc(m.name)}</h4>
      <div class="meal-macros">
        <span><b>${m.kcal}</b> kcal</span>
        <span><b>${m.p}g</b> protein</span>
        <span><b>${m.c}g</b> carbs</span>
        <span><b>${m.f}g</b> fat</span>
      </div>
    </div>`).join("");

  setHTML("dietDayBody", `
    ${meals}
    <div class="card" style="background:var(--panel-2);">
      <h3>${esc(WEEKDAYS[activeDayIndex])} totals</h3>
      <div class="stat-grid-4">
        <div class="stat"><div class="stat-val">${dayData.totals.kcal}</div><div class="stat-lab">Calories</div></div>
        <div class="stat"><div class="stat-val">${dayData.totals.p}g</div><div class="stat-lab">Protein</div></div>
        <div class="stat"><div class="stat-val">${dayData.totals.c}g</div><div class="stat-lab">Carbs</div></div>
        <div class="stat"><div class="stat-val">${dayData.totals.f}g</div><div class="stat-lab">Fat</div></div>
      </div>
      <p class="note">${esc(diffLabel)}</p>
    </div>`);
}

function regenerate() {
  if (!state.diet.type) return;

  state.diet.offset = (state.diet.offset || 0) + 1;
  state.diet.plan = generateDietPlan(
    state.diet.type,
    state.diet.targetCalories,
    state.diet.offset
  );
  saveState();
  renderDiet();
}

export function initDietView({ setupDiet }) {
  onSetupDiet = setupDiet;
  registerScreen("screen-diet", renderDiet);
  $("btnRegenDiet").addEventListener("click", regenerate);
}
