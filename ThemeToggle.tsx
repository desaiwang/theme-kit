"use client";
import { useEffect, useState } from "react";
import { THEME_COOKIE_MAX_AGE_SECONDS, THEME_COOKIE_NAME, type ArcadeTheme } from "./constants";
import styles from "./arcade.module.css";

const wrapper = () => document.querySelector<HTMLElement>("[data-arcade]");

// Resolve what is on screen: the saved theme, or the system setting when none is saved.
function currentTheme(): ArcadeTheme {
  const saved = wrapper()?.dataset.theme;
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ArcadeTheme>("light");

  useEffect(() => setTheme(currentTheme()), []);

  const toggle = () => {
    const next: ArcadeTheme = currentTheme() === "dark" ? "light" : "dark";
    const el = wrapper();
    if (el) el.dataset.theme = next;
    // path=/ so every page of the site, and the old design's own toggle, remember the same choice
    document.cookie = `${THEME_COOKIE_NAME}=${next}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    setTheme(next);
  };

  return (
    <button type="button" className={styles.themeBtn} onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
