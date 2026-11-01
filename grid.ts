/*
 * Character grid (same idea as aino.agency): pick --ch, the width of one mono character
 * (about 8px), so every column holds a whole number of characters. Font size, line height,
 * gutters and page margins all derive from --ch in arcade.module.css.
 *   4 columns:          W = 4·cols·ch + 3 gutters of 2ch + 2 margins of 4ch  →  ch = W / (4·cols + 14)
 *   1 column (≤768px):  W = cols·ch + 2 margins of 3ch                        →  ch = W / (cols + 6)
 * Keep MARGIN_CH / GUTTER_CH in sync with --margin / --gut in arcade.module.css.
 * Kept self-contained (no imports or closures) because it is also stringified into an inline script.
 */
export function fitGrid() {
  // set on the Arcade wrapper (not <html>, which desaiwang.com shares with its old design)
  const root = document.querySelector<HTMLElement>("[data-arcade]");
  if (!root) return;
  const W = document.documentElement.clientWidth;
  const one = W <= 768;
  const TARGET = 8;
  const GUTTER_CH = 2;
  const MARGIN_CH = one ? 3 : 4;
  const fixed = one ? 2 * MARGIN_CH : 3 * GUTTER_CH + 2 * MARGIN_CH;
  const cols = Math.max(12, Math.round(one ? W / TARGET - fixed : (W / TARGET - fixed) / 4));
  const ch = W / (one ? cols + fixed : 4 * cols + fixed);
  root.style.setProperty("--ch", ch.toFixed(4) + "px");
  root.dataset.cols = String(cols);
}

// Inline version for first paint, rendered by the layout as a <script>.
export const GRID_SCRIPT = `(${fitGrid.toString()})();`;
