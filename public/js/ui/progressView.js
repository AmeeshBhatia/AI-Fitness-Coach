/**
 * PROGRESS VIEW
 * Weekly weight logging with change vs previous entry and workout completion.
 */

import { state, saveState } from "../lib/store.js";
import { calcBMI } from "../lib/calculations.js";
import { completionPercentage } from "../lib/workoutEngine.js";
import { $, esc, setHTML, showError, clearError } from "./dom.js";
import { registerScreen } from "./router.js";

export function renderProgress() {
  renderSummary();
  renderHistory();
}

function renderSummary() {
  const history = state.progress;
  const pct = completionPercentage(state.workout.plan, state.workout.completed);

  if (history.length === 0) {
    setHTML("progressSummary", `
      <div class="card">
        <div class="stat-grid-3">
          <div class="stat"><div class="stat-val neutral">&mdash;</div><div class="stat-lab">Weight Change</div></div>
          <div class="stat"><div class="stat-val neutral">&mdash;</div><div class="stat-lab">BMI Change</div></div>
          <div class="stat"><div class="stat-val">${pct}%</div><div class="stat-lab">Workouts Done</div></div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p class="note">Log your weight to start tracking change over time.</p>
      </div>`);
    return;
  }

  const last = history[history.length - 1];
  const prev = history.length > 1 ? history[history.length - 2] : null;
  const first = history[0];

  const weightDelta = prev ? round1(last.weight - prev.weight) : null;
  const bmiDelta = prev && prev.bmi != null && last.bmi != null
    ? round1(last.bmi - prev.bmi)
    : null;
  const totalDelta = round1(last.weight - first.weight);

  setHTML("progressSummary", `
    <div class="card">
      <div class="stat-grid-3">
        <div class="stat">
          <div class="stat-val ${deltaClass(weightDelta)}">${formatDelta(weightDelta, "kg")}</div>
          <div class="stat-lab">Since Last Log</div>
        </div>
        <div class="stat">
          <div class="stat-val ${deltaClass(bmiDelta)}">${formatDelta(bmiDelta, "")}</div>
          <div class="stat-lab">BMI Change</div>
        </div>
        <div class="stat">
          <div class="stat-val">${pct}%</div>
          <div class="stat-lab">Workouts Done</div>
        </div>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="mini-list">
        <div class="mini-row"><span>Current weight</span><span>${last.weight} kg</span></div>
        ${last.bmi != null ? `<div class="mini-row"><span>Current BMI</span><span>${last.bmi}</span></div>` : ""}
        <div class="mini-row"><span>Total change (${history.length} logs)</span>
          <span>${history.length > 1 ? formatDelta(totalDelta, "kg") : "—"}</span></div>
      </div>
    </div>`);
}

function renderHistory() {
  const history = state.progress;

  if (history.length === 0) {
    setHTML("progressHistory", `<div class="empty">No entries yet. Log your first week above.</div>`);
    return;
  }

  const rows = history.slice().reverse().map((entry, i) => {
    const realIndex = history.length - 1 - i;
    const previous = realIndex > 0 ? history[realIndex - 1] : null;
    const delta = previous ? round1(entry.weight - previous.weight) : null;

    return `<div class="log-row">
      <div>
        <strong>${entry.weight} kg</strong>
        ${entry.bmi != null ? ` · BMI ${entry.bmi}` : ""}
        ${delta !== null ? ` · <span style="color:var(--muted)">${formatDelta(delta, "kg")}</span>` : ""}
        ${entry.photoNote ? `<div class="sub-label">${esc(entry.photoNote)}</div>` : ""}
      </div>
      <div class="log-date">${esc(entry.date)}</div>
    </div>`;
  }).join("");

  setHTML("progressHistory", `<div class="card">${rows}</div>`);
}

function logEntry() {
  const weightInput = $("inProgWeight");
  const noteInput = $("inProgPhoto");
  const weight = parseFloat(weightInput.value);

  if (!weight) return showError("progressError", "Please enter your current weight.");
  if (weight < 35 || weight > 250) {
    return showError("progressError", "Please enter a weight between 35 and 250 kg.");
  }
  clearError("progressError");

  state.progress.push({
    date: new Date().toISOString().slice(0, 10),
    weight: round1(weight),
    bmi: state.profile ? calcBMI(weight, state.profile.height) : null,
    photoNote: noteInput.value.trim() || null
  });

  // Keep the profile weight current so future BMI/calorie maths stay accurate
  if (state.profile) state.profile.weight = round1(weight);

  weightInput.value = "";
  noteInput.value = "";
  saveState();
  renderProgress();
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function formatDelta(value, unit) {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}${unit ? " " + unit : ""}`;
}

function deltaClass(value) {
  if (value === null) return "neutral";
  if (value < 0) return "down";
  if (value > 0) return "up";
  return "neutral";
}

export function initProgressView() {
  registerScreen("screen-progress", renderProgress);
  $("btnLogProgress").addEventListener("click", logEntry);
  $("formProgress").addEventListener("submit", (e) => {
    e.preventDefault();
    logEntry();
  });
}
