import React from "react";
import GridSizer from "./GridSizer";
import { GRID_SCRIPT } from "./grid";
import type { ArcadeTheme } from "./constants";
import styles from "./arcade.module.css";

/*
 * The Arcade frame: the themed wrapper every page sits inside, plus the character-grid wiring.
 * Each site composes its own header, main and footer as children, so the chrome can differ
 * while the grid, theme and type stay identical.
 */
export default function ArcadeShell({
  theme,
  fontClass = "",
  tokenCss,
  children,
}: {
  /** From the theme cookie. Leave undefined to follow the system setting. */
  theme?: ArcadeTheme;
  /** className from next/font — pass `plexMono.variable` (see fonts.ts). */
  fontClass?: string;
  /** Optional extra CSS injected inside the wrapper, e.g. desaiwang.com's legacy token bridge. */
  tokenCss?: string;
  children: React.ReactNode;
}) {
  return (
    // the grid script and theme toggle adjust this element's style/data attributes on the client
    <div className={`${styles.root} ${fontClass}`} data-arcade="" data-theme={theme} suppressHydrationWarning>
      {/* size the character grid before first paint; GridSizer keeps it in sync after client navigation */}
      <script dangerouslySetInnerHTML={{ __html: GRID_SCRIPT }} />
      {tokenCss ? <style dangerouslySetInnerHTML={{ __html: tokenCss }} /> : null}
      <GridSizer />
      {children}
    </div>
  );
}
