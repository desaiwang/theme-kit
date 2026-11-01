"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./arcade.module.css";

export type IndexRow = {
  num: string;
  title: string;
  kind?: string;
  year?: string;
  href: string;
  image?: string;
  imageAlt?: string;
  tone?: string; // fallback tile colour when the image is missing
  preview?: string; // text shown beside the row when there is no image (e.g. a note's abstract)
};

export type IndexGroup = { id: string; label: string; href?: string; rows: IndexRow[] };

type Active = { row: IndexRow; el: HTMLElement } | null;

/*
 * Labels sit in col 1, rows across cols 3–4. Hovering a row shows its image (or, for notes,
 * its abstract) from just right of the labels through col 2, centred on the row and kept inside the index.
 */
export default function Index({
  groups,
  className = "",
  /** Show the type column (Product, Data, a note's first tag…). Off by default: rows read number, title, date. */
  showKind = false,
}: {
  groups: IndexGroup[];
  className?: string;
  showKind?: boolean;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active>(null);
  const [top, setTop] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const row = active?.row;
  const showImage = !!row?.image;
  const showText = !!row && !showImage && !!row.preview;

  // after React has rendered the hovered row's image or text, centre that box on the row
  useLayoutEffect(() => {
    const box = showImage ? imgRef.current : showText ? textRef.current : null;
    if (!active || !box || !colRef.current) return;
    const col = colRef.current.getBoundingClientRect();
    const r = active.el.getBoundingClientRect();
    const t = r.top - col.top + r.height / 2 - box.offsetHeight / 2;
    setTop(Math.max(0, Math.min(t, colRef.current.offsetHeight - box.offsetHeight)));
  }, [active, showImage, showText]);

  // the hover column starts just past the longest section label
  const labelChars = Math.max(...groups.map((g) => g.label.length));

  const show = (r: IndexRow, el: HTMLElement) => setActive(r.image || r.preview ? { row: r, el } : null);
  return (
    <section className={`${styles.index} ${styles.g4} ${className}`}>
      <div className={styles.imageCol} ref={colRef} aria-hidden="true" style={{ "--label-chars": labelChars } as React.CSSProperties}>
        <div ref={imgRef} className={styles.hov} data-on={showImage} style={{ top: showImage ? top : 0, background: row?.tone }}>
          {row?.image && !broken[row.image] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.image} alt="" onError={() => setBroken((b) => ({ ...b, [row.image!]: true }))} />
          ) : row?.image ? (
            <span className={styles.hovFallback}>{row.title}</span>
          ) : null}
        </div>
        <div ref={textRef} className={styles.hovText} data-on={showText} style={{ top: showText ? top : 0 }}>
          {showText ? row.preview : null}
        </div>
      </div>

      <div className={styles.groups}>
        {groups.map((g) => (
          <div key={g.id} id={g.id} className={styles.group}>
            {g.href ? <h2><Link href={g.href}>{g.label}</Link></h2> : <h2>{g.label}</h2>}
            {g.rows.map((r) => {
              const external = r.href.startsWith("http");
              const content = (
                <>
                  <span className={styles.num}>{r.num}</span>
                  <span className={styles.title} data-wide={!showKind || undefined}>{r.title}</span>
                  {showKind && r.kind && <span className={styles.kind}>{r.kind}</span>}
                  {r.year && <span className={styles.year}>{r.year}</span>}
                </>
              );
              const props = {
                className: styles.row,
                onMouseEnter: (e: React.MouseEvent<HTMLElement>) => show(r, e.currentTarget),
                onFocus: (e: React.FocusEvent<HTMLElement>) => show(r, e.currentTarget),
                onMouseLeave: () => setActive(null),
                onBlur: () => setActive(null),
              };
              return external ? (
                <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" {...props}>{content}</a>
              ) : (
                <Link key={r.href} href={r.href} {...props}>{content}</Link>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
