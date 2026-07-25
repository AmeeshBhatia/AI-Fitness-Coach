/**
 * WORKOUT VIEW
 * Weekly schedule tabs, the day's exercise list, regenerate, replace,
 * and mark-complete.
 */

import { state, saveState } from "../lib/store.js";
import { EXERCISES } from "../data/exercises.js";
import { SPLITS, WEEKDAYS } from "../data/workouts.js";
import {
  regenerateDay, replaceExercise, getAlternatives,
  totalSets, estimatedDuration, todayName
} from "../lib/workoutEngine.js";
import { $, esc, setText, setHTML, button } from "./dom.js";
import { registerScreen } from "./router.js";
import { openExerciseModal } from "./exerciseModal.js";

let activeDay = null;

function currentPlan() {
  return state.workout.plan;
}

/** Default to today if it's a training day, else the first training day. */
function defaultDay() {
  const plan = currentPlan();
  if (!plan) return WEEKDAYS[0];

  const today = todayName();
  if (plan[today] && plan[today].typeKey !== "Rest") return today;

  return WEEKDAYS.find((d) => plan[d] && plan[d].typeKey !== "Rest") || WEEKDAYS[0];
}

export function setActiveDay(day) {
  activeDay = day;
}

export function renderWorkout() {
  const plan = currentPlan();
  if (!plan) return;

  if (!activeDay || !plan[activeDay]) activeDay = defaultDay();

  const split = SPLITS[state.workout.split];
  setText("workoutSplitLabel", `${split.label} · ${state.workout.days} days a week`);

  renderTabs();
  renderDayBody();
}

function renderTabs() {
  const container = $("workoutDayTabs");
  const plan = currentPlan();
  container.innerHTML = "";

  WEEKDAYS.forEach((day) => {
    const dayData = plan[day];
    const classes = ["", day === activeDay ? "is-active" : "",
      dayData.typeKey === "Rest" ? "is-rest" : "",
      state.workout.completed[day] ? "is-done" : ""].join(" ").trim();

    container.appendChild(button({
      className: classes,
      text: day.slice(0, 3),
      attrs: { "aria-label": day },
      onClick: () => {
        activeDay = day;
        renderTabs();
        renderDayBody();
      }
    }));
  });
}

function renderDayBody() {
  const body = $("workoutDayBody");
  const day = currentPlan()[activeDay];

  if (day.typeKey === "Rest") {
    body.innerHTML = `<div class="empty">
      <strong>${esc(activeDay)} &mdash; Rest day</strong><br />
      Recovery is when adaptation happens. Stay hydrated, eat to your targets and sleep well.
    </div>`;
    return;
  }

  const isDone = Boolean(state.workout.completed[activeDay]);
  const sets = totalSets(day);
  const mins = estimatedDuration(day);

  body.innerHTML = `
    <div class="card" id="dayCard">
      <div class="screen-head" style="margin-bottom:6px;">
        <div>
          <strong style="font-size:15px;">${esc(day.typeLabel)}</strong>
          <div class="sub-label">${day.exercises.length} exercises · ${sets} sets · ~${mins} min</div>
        </div>
        <button class="btn btn-small btn-secondary" id="btnRegenDay" type="button">Regenerate</button>
      </div>
      <div id="exList"></div>
    </div>
    <button class="btn ${isDone ? "btn-secondary" : ""}" id="btnToggleDone" type="button">
      ${isDone ? "✓ Completed" : "Mark Workout Complete"}
    </button>`;

  renderExerciseList(day);

  $("btnRegenDay").addEventListener("click", () => {
    state.workout.plan[activeDay] = regenerateDay(day);
    saveState();
    renderDayBody();
  });

  $("btnToggleDone").addEventListener("click", () => {
    state.workout.completed[activeDay] = !state.workout.completed[activeDay];
    saveState();
    renderTabs();
    renderDayBody();
  });
}

function renderExerciseList(day) {
  const list = $("exList");
  list.innerHTML = "";

  day.exercises.forEach((ex, index) => {
    const info = EXERCISES[ex.id];
    const canReplace = getAlternatives(ex.id).some(
      (id) => !day.exercises.some((e, i) => i !== index && e.id === id)
    );

    const row = document.createElement("div");
    row.className = "ex-row";

    const main = document.createElement("div");
    main.className = "ex-main";
    main.innerHTML = `
      <div class="ex-order">${ex.order}</div>
      <div>
        <button class="ex-name" type="button">${esc(info.name)}</button>
        <div class="ex-meta">
          ${ex.sets} × ${esc(ex.reps)} · Rest ${ex.rest}s · ${esc(info.muscle)}
        </div>
      </div>`;
    main.querySelector(".ex-name").addEventListener("click", () => openExerciseModal(ex.id));

    const actions = document.createElement("div");
    actions.className = "ex-actions";
    const replaceBtn = button({
      className: "icon-btn",
      text: "Replace",
      onClick: () => {
        state.workout.plan[activeDay] = replaceExercise(state.workout.plan[activeDay], index);
        saveState();
        renderDayBody();
      }
    });
    if (!canReplace) {
      replaceBtn.disabled = true;
      replaceBtn.style.opacity = ".45";
      replaceBtn.title = "No alternative available";
    }
    actions.appendChild(replaceBtn);

    row.append(main, actions);
    list.appendChild(row);
  });
}

export function initWorkoutView({ onChangeSplit }) {
  registerScreen("screen-workout", renderWorkout);
  $("btnChangeSplit").addEventListener("click", onChangeSplit);
}
