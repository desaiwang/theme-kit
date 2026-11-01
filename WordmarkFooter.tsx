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
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(nowIn(timeZone));
    const id = setInterval(() => setTime(nowIn(timeZone)), 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <footer className={styles.foot}>
      <p className={styles.wordmark} aria-label={wordmark}>{wordmark}</p>
      <div className={`${styles.meta} ${styles.g4}`}>
        <span>{place}<br /><span suppressHydrationWarning>{time}</span></span>
        <span>{email ? <>Say hi<br /><a href={`mailto:${email}`}>{email}</a></> : null}</span>
        <span>
          {linksLabel && <>{linksLabel}<br /></>}
          {links.map((l, i) => (
            <span key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              {i < links.length - 1 && <br />}
            </span>
          ))}
        </span>
        <span>
          {yearLabel ? <>{yearLabel}<br />{new Date().getFullYear()}</> : <>©{new Date().getFullYear()}</>}
        </span>
      </div>
    </footer>
  );
}
