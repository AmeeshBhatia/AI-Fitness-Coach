/**
 * EXERCISE LIBRARY VIEW
 * Searchable, filterable list of every exercise with links to the guide modal.
 */

import { EXERCISES, MUSCLE_LABELS, RELATED_MUSCLES } from "../data/exercises.js";
import { $, esc, setHTML } from "./dom.js";
import { registerScreen } from "./router.js";
import { openExerciseModal } from "./exerciseModal.js";

let query = "";
let filter = "all";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "shoulders", label: "Shoulders" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "quads", label: "Legs" },
  { id: "hamstrings", label: "Hamstrings" },
  { id: "glutes", label: "Glutes" },
  { id: "calves", label: "Calves" },
  { id: "abs", label: "Core" }
];

export function renderLibrary() {
  renderFilters();
  renderList();
}

function renderFilters() {
  const container = $("libraryFilters");
  container.innerHTML = "";

  FILTERS.forEach((f) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${filter === f.id ? " is-active" : ""}`;
    btn.textContent = f.label;
    btn.addEventListener("click", () => {
      filter = f.id;
      renderLibrary();
    });
    container.appendChild(btn);
  });
}

function matchesFilter(ex) {
  if (filter === "all") return true;
  const group = RELATED_MUSCLES[filter] || [filter];
  return group.includes(ex.primary);
}

function matchesQuery(ex) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    ex.name.toLowerCase().includes(q) ||
    ex.muscle.toLowerCase().includes(q) ||
    ex.equipment.toLowerCase().includes(q) ||
    (MUSCLE_LABELS[ex.primary] || "").toLowerCase().includes(q)
  );
}

function renderList() {
  const entries = Object.entries(EXERCISES)
    .filter(([, ex]) => matchesFilter(ex) && matchesQuery(ex))
    .sort((a, b) => a[1].name.localeCompare(b[1].name));

  if (entries.length === 0) {
    setHTML("libraryList", `<div class="empty">No exercises match that search.</div>`);
    return;
  }

  const rows = entries.map(([id, ex]) => `
    <div class="ex-row">
      <div class="ex-main">
        <div>
          <button class="ex-name" type="button" data-ex-id="${esc(id)}">${esc(ex.name)}</button>
          <div class="ex-meta">${esc(ex.muscle)} · ${esc(ex.equipment)}</div>
        </div>
      </div>
      <div class="ex-actions">
        <button class="icon-btn" type="button" data-ex-id="${esc(id)}">Guide</button>
      </div>
    </div>`).join("");

  setHTML("libraryList", `
    <div class="card">${rows}</div>
    <p class="note">${entries.length} exercise${entries.length === 1 ? "" : "s"} shown</p>`);

  $("libraryList").querySelectorAll("[data-ex-id]").forEach((btn) => {
    btn.addEventListener("click", () => openExerciseModal(btn.dataset.exId));
  });
}

export function initLibraryView() {
  registerScreen("screen-library", renderLibrary);

  $("librarySearch").addEventListener("input", (e) => {
    query = e.target.value.trim();
    renderList();
  });
}
