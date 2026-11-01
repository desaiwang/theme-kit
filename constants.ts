// The theme choice is stored in a cookie so the server can render the right theme on first paint.
// Both sites use the same name; on desaiwang.com it must match COLOR_THEME_COOKIE_NAME in
// src/app/(portfolio)/notes/helpers/constants.ts, because the old design's toggle writes the same cookie.
export const THEME_COOKIE_NAME = "color-theme";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ArcadeTheme = "light" | "dark";

/** Narrow a raw cookie value to a theme, or undefined to follow the system setting. */
export function readTheme(value: string | undefined): ArcadeTheme | undefined {
  return value === "dark" || value === "light" ? value : undefined;
}
