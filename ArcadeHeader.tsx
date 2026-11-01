import React from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import styles from "./arcade.module.css";

export type NavLink = {
  label: string;
  href: string;
  /** underline it as the current section */
  current?: boolean;
  /** open in a new tab (set automatically for http links) */
  external?: boolean;
};

// Name far left; nav from the col-3 line (centred on phones); theme toggle far right.
// With no links the nav is left out entirely, rather than rendering an empty landmark.
export default function ArcadeHeader({
  name,
  homeHref = "/",
  links = [],
}: {
  name: string;
  homeHref?: string;
  links?: NavLink[];
}) {
  return (
    <header className={`${styles.top} ${styles.g4}`}>
      <Link href={homeHref} className={styles.name}>{name}</Link>
      {links.length > 0 && (
        <nav aria-label="Main">
          {links.map((l) =>
            (l.external ?? l.href.startsWith("http")) ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : (
              <Link key={l.href} href={l.href} aria-current={l.current ? "page" : undefined}>{l.label}</Link>
            ),
          )}
        </nav>
      )}
      <ThemeToggle />
    </header>
  );
}
