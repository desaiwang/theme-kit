# theme-kit

The shared Arcade design layer: the white Swiss look on a 4-column character grid, used by

| Site | Repo | Mounted at |
| --- | --- | --- |
| **desaiwang.com** (the `/v2` redesign) | `desaiwang/portfolio-nextjs` | `src/theme-kit` |
| **desaimakes.com** | `desaiwang/desaimakes` | `src/theme-kit` |

Both repos include this one as a **git submodule**, so there is a single copy of the CSS and
components. A style change made from inside either checkout is the same change for both sites.

## What's in here

| File | What it is |
| --- | --- |
| `arcade.module.css` | Every style: tokens, the grid, header, hero, index, post, case-study and footer blocks. The one file to edit for a look change. |
| `grid.ts` | `fitGrid()` sizes `--ch` so the page fits a whole number of monospace columns, plus `GRID_SCRIPT` for the inline first-paint call. |
| `GridSizer.tsx` | Keeps the grid in sync on resize and after client navigation. |
| `ArcadeShell.tsx` | The themed wrapper: `[data-arcade]` root, grid script, optional extra CSS. Each site composes its own header/main/footer inside it. |
| `ArcadeHeader.tsx` | Name, nav links, theme toggle. Links are passed in, so the nav can differ per site — or be left out. |
| `WordmarkFooter.tsx` | The oversized wordmark with place, clock, email and links. |
| `Index.tsx` | The numbered index with the hover image / abstract column. The main content component. |
| `ThemeToggle.tsx` | Light/dark, written to the `color-theme` cookie. |
| `constants.ts` | Cookie name and `readTheme()`. |
| `fonts.ts` | IBM Plex Mono via `next/font`, exposed as `--font-plex-mono`. |

Everything is imported by relative path (`./arcade.module.css`), so the kit works wherever it's
mounted. Consuming repos alias it as `@kit/*`.

**Requires:** Next.js 15+ (App Router), React 19, and CSS Modules — no other dependencies, no
Tailwind. There is deliberately no `package.json`: a nested one would make Next treat this folder
as a package boundary.

## Per-site options

Where the two sites need to differ, the kit takes a prop rather than forking. **Every one of these
is off by default**, so adding one can never change the site that doesn't pass it.

| Component | Prop | Does |
| --- | --- | --- |
| `ArcadeHeader` | `links` | Nav items. Omit it and the `<nav>` is left out entirely, rather than rendering an empty landmark. |
| `Index` | `showKind` | Bring back the type column (Product, Data, a note's first tag…). Rows otherwise read number, title, date. |
| `Index` | `bleed` | Let the hover image run past the bottom of the index. For a short index the image is taller than the rows, so clamping pins every row to the same spot; bleeding lets it spill into whatever is below. A long index would spill into the footer, hence off by default. |
| `WordmarkFooter` | `linksLabel` | A label line above the links column, the way `place` labels the clock. |
| `WordmarkFooter` | `yearLabel` | A label line above the year. With one, the year drops its `©`, since it is no longer a copyright line. |
| `WordmarkFooter` | `updated` | An ISO date rendered as "Sep 2026" in the year column, so a site can show when its content changed rather than today's date. |
| `WordmarkFooter` | `mutedLabels` | Grey every column's label line, leaving the values in ink — the treatment `.postMeta` already uses. |
| `ArcadeShell` | `tokenCss` | Extra CSS injected inside the wrapper, e.g. desaiwang.com's bridge mapping the old site's tokens onto Arcade's. |

As of now desaimakes.com passes `bleed`, `linksLabel`, `yearLabel`, `updated` and `mutedLabels`
and no `links`; desaiwang.com passes `links` and `tokenCss`.

## Working on it

The submodule is a real checkout, so edit the files in place from whichever site you're in:

```bash
cd portfolio-nextjs        # or desaimakes — either works
vim src/theme-kit/arcade.module.css
npm run dev                # the change shows up in that site immediately

# publish it
cd src/theme-kit
git commit -am "Arcade: tighter row hover"
git push

# then point each site at the new commit
cd ../..                   # back to the site you were in
git commit -am "Bump theme-kit" src/theme-kit && git push

cd ../desaimakes           # and the other one
npm run kit:bump           # git submodule update --remote --merge
git commit -am "Bump theme-kit" src/theme-kit && git push
```

`.gitmodules` sets `branch = main`, and `kit:bump` passes `--merge`, so the submodule stays on
`main` and stays editable. A plain `git submodule update` leaves it on a detached HEAD; if that
happens, `git -C src/theme-kit checkout main` puts it back.

The pointer bump is what makes the change real for a site — a commit in the kit alone changes
nothing until each parent repo records the new SHA. Both sites deploy on Vercel, which checks out
the SHA each repo has recorded, so **a site that hasn't been bumped keeps the old look**. That's
the safety net: you can land a style change on one site, look at it, then bump the other.

## What belongs here, and what doesn't

**Here:** anything about the *look* — tokens, grid maths, type, spacing, the index and its hover
behaviour, the header and footer shapes.

**Not here:** anything about one site's *content or routes* — `paths.ts`, row builders, data files,
page components, and desaiwang.com's `legacyTokens.ts` bridge. Site-only styles go in a local CSS
module in that repo (e.g. `desaimakes/src/app/site.module.css`), which can freely use the tokens
(`var(--unit)`, `var(--ink)`, `var(--accent)`…) that `.root` sets.

If a block of CSS would only ever be used by one site, keep it in that site. Two consumers is
what earns a place in here.

## Deploying sites that use this

This repo is **private**, which Vercel does not clone by default. For a site that uses it to
build, the Vercel GitHub App must be granted access to **this repo as well as the site's** —
GitHub → Settings → Applications → Vercel → Repository access. Without it the build fails with
`Cannot find module '@kit/...'`, which looks like a path problem but is a permissions one.

`.gitmodules` in each site must use the `https://` URL, not `git@github.com:…` — Vercel clones
submodules over HTTPS:

```
url = https://github.com/desaiwang/theme-kit.git
```

Making this repo public would remove the access step entirely; it holds no personal content.

`~/Documents/GitHub/theme-kit` is a spare clone kept for convenience — the checkouts that matter
are the ones inside each site.
