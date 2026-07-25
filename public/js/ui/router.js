/**
 * ROUTER
 *
 * Shows one screen at a time and keeps the bottom tab bar in sync.
 * Each main tab registers a render function so navigating to a tab always
 * paints fresh data — this avoids the class of bug where a screen is shown
 * before its content has been rendered.
 */

import { $, $$ } from "./dom.js";

const renderers = new Map();

/** Register the render function for a screen. */
export function registerScreen(screenId, renderFn) {
  renderers.set(screenId, renderFn);
}

/** Navigate to a screen, rendering it first if it has a renderer. */
export function goTo(screenId) {
  const renderFn = renderers.get(screenId);
  if (renderFn) renderFn();

  $$(".screen").forEach((s) => s.classList.toggle("is-active", s.id === screenId));

  $$(".tabbar button").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.tab === screenId)
  );

  window.scrollTo(0, 0);
}

/** Show or hide the top bar and bottom nav (hidden during onboarding). */
export function showAppChrome(visible) {
  const topbar = $("topbar");
  const tabbar = $("tabbar");
  if (topbar) topbar.hidden = !visible;
  if (tabbar) tabbar.hidden = !visible;
}

/** Wire the bottom nav buttons and any [data-back] buttons. */
export function initRouter() {
  $$(".tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.tab));
  });

  $$("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.back));
  });
}
