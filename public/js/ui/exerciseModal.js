/**
 * EXERCISE GUIDE MODAL
 * Description, target muscle, equipment, form tips and common mistakes.
 */

import { EXERCISES, MUSCLE_LABELS } from "../data/exercises.js";
import { getAlternatives } from "../lib/workoutEngine.js";
import { esc, setText, setHTML, openModal } from "./dom.js";

export function openExerciseModal(exerciseId) {
  const ex = EXERCISES[exerciseId];
  if (!ex) return;

  setText("exModalMuscle", ex.muscle);
  setText("exModalName", ex.name);
  setText("exModalDesc", ex.desc);

  const alternatives = getAlternatives(exerciseId).slice(0, 3);
  const meta = [
    `<span class="pill">${esc(capitalise(ex.equipment))}</span>`,
    `<span class="pill">${esc(MUSCLE_LABELS[ex.primary] || ex.primary)}</span>`,
    ...alternatives.map(
      (id) => `<span class="pill">Alt: ${esc(EXERCISES[id].name)}</span>`
    )
  ];
  setHTML("exModalMeta", meta.join(""));

  setHTML("exModalTips", ex.tips.map((t) => `<li>${esc(t)}</li>`).join(""));
  setHTML("exModalMistakes", ex.mistakes.map((m) => `<li>${esc(m)}</li>`).join(""));

  openModal("exerciseModal");
}

function capitalise(word) {
  return String(word).charAt(0).toUpperCase() + String(word).slice(1);
}
