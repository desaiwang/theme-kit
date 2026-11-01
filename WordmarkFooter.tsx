"use client";
import { useEffect, useState } from "react";
import styles from "./arcade.module.css";

export type FooterLink = { label: string; href: string };

// Live clock, e.g. "09:54:01".
function nowIn(timeZone: string) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

/*
 * The oversized wordmark, with place + clock, an email and links along the bottom.
 * Each site passes its own wordmark ("desai.wang" / "desai.makes") and links, and may label
 * the links and year columns the way the first two columns are labelled.
 */
export default function WordmarkFooter({
  wordmark,
  place = "New York",
  timeZone = "America/New_York",
  email,
  links = [],
  linksLabel,
  yearLabel,
  updated,
  mutedLabels = false,
}: {
  wordmark: string;
  place?: string;
  timeZone?: string;
  email?: string;
  links?: FooterLink[];
  /** optional label above the links column, e.g. "Videos on" */
  linksLabel?: string;
  /** optional label above the year, e.g. "Updated". With one, the year drops its © */
  yearLabel?: string;
  /** ISO date behind the year column, shown as "Sep 2026". Without it, the current year. */
  updated?: string;
  /** grey the label line of every column, leaving the values in full contrast */
  mutedLabels?: boolean;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(nowIn(timeZone));
    const id = setInterval(() => setTime(nowIn(timeZone)), 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  // the label line of each column; muted when the site asks for it
  const label = mutedLabels ? styles.footLabel : undefined;
  // "Sep 2026" when the site passes a date, otherwise just this year
  const stamp = updated
    ? new Date(updated).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    : String(new Date().getFullYear());

  return (
    <footer className={styles.foot}>
      <p className={styles.wordmark} aria-label={wordmark}>{wordmark}</p>
      <div className={`${styles.meta} ${styles.g4}`}>
        <span>
          <span className={label}>{place}</span>
          <br />
          <span suppressHydrationWarning>{time}</span>
        </span>
        <span>
          {email ? (
            <>
              <span className={label}>Say hi</span>
              <br />
              <a href={`mailto:${email}`}>{email}</a>
            </>
          ) : null}
        </span>
        <span>
          {linksLabel && (
            <>
              <span className={label}>{linksLabel}</span>
              <br />
            </>
          )}
          {links.map((l, i) => (
            <span key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              {i < links.length - 1 && <br />}
            </span>
          ))}
        </span>
        <span>
          {yearLabel ? (
            <>
              <span className={label}>{yearLabel}</span>
              <br />
              {stamp}
            </>
          ) : (
            <>©{new Date().getFullYear()}</>
          )}
        </span>
      </div>
    </footer>
  );
}
