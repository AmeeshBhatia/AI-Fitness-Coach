/**
 * DOM HELPERS
 * Small utilities shared by the view modules.
 */

export const $ = (id) => document.getElementById(id);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/** Escape user-supplied text before inserting into innerHTML. */
export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

export function setHTML(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

export function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

export function show(id) {
  const el = $(id);
  if (el) el.hidden = false;
}

export function hide(id) {
  const el = $(id);
  if (el) el.hidden = true;
}

export function showError(id, message) {
  const el = $(id);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

export function clearError(id) {
  const el = $(id);
  if (!el) return;
  el.textContent = "";
  el.hidden = true;
}

/** Build a <button> element with classes, text/HTML and a click handler. */
export function button({ className = "", html = "", text = "", onClick, attrs = {} }) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  if (html) el.innerHTML = html;
  else el.textContent = text;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (onClick) el.addEventListener("click", onClick);
  return el;
}

/** Render a list of selectable option buttons into a container. */
export function renderOptions(containerId, items, selectedId, onSelect, opts = {}) {
  const container = $(containerId);
  if (!container) return;

  container.innerHTML = "";
  items.forEach((item) => {
    const isSelected = item.id === selectedId;
    const el = button({
      className: `option${opts.center ? " option-center" : ""}${isSelected ? " is-selected" : ""}`,
      html: item.blurb
        ? `${esc(item.label)}<small>${esc(item.blurb)}</small>`
        : esc(item.label),
      onClick: () => onSelect(item.id)
    });
    container.appendChild(el);
  });
}

export function openModal(id) {
  const el = $(id);
  if (el) el.hidden = false;
}

export function closeModal(id) {
  const el = $(id);
  if (el) el.hidden = true;
}

/** Wire up modal close buttons and click-on-backdrop-to-dismiss. */
export function initModals() {
  $$("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  $$(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    $$(".modal-overlay").forEach((overlay) => { overlay.hidden = true; });
  });
}
