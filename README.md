# arcade-kit

The shared Arcade design layer: the white Swiss look on a 4-column character grid, used by

| Site | Repo | Mounted at |
| --- | --- | --- |
| **desaiwang.com** (the `/v2` redesign) | `desaiwang/portfolio-nextjs` | `src/arcade-kit` |
| **desaimakes.com** | `desaiwang/desaimakes` | `src/arcade-kit` |

Both repos include this one as a **git submodule**, so there is a single copy of the CSS and
components. A style change made from inside either checkout is the same change for both sites.

## What's in here

| File | What it is |
| --- | --- |
| `arcade.module.css` | Every style: tokens, the grid, header, hero, index, post, case-study and footer blocks. The one file to edit for a look change. |
| `grid.ts` | `fitGrid()` sizes `--ch` so the page fits a whole number of monospace columns, plus `GRID_SCRIPT` for the inline first-paint call. |
| `GridSizer.tsx` | Keeps the grid in sync on resize and after client navigation. |
| `ArcadeShell.tsx` | The themed wrapper: `[data-arcade]` root, grid script, optional extra CSS. Each site composes its own header/main/footer inside it. |
| `ArcadeHeader.tsx` | Name, nav links, theme toggle. Links are passed in, so the nav can differ per site. |
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

## Working on it

The submodule is a real checkout, so edit the files in place from whichever site you're in:

```bash
cd portfolio-nextjs        # or desaimakes — either works
vim src/arcade-kit/arcade.module.css
npm run dev                # the change shows up in that site immediately

# publish it
cd src/arcade-kit
git commit -am "Arcade: tighter row hover"
git push

# then point each site at the new commit
cd ../..                   # back to the site you were in
git commit -am "Bump arcade-kit" src/arcade-kit && git push

cd ../desaimakes           # and the other one
npm run kit:bump           # git submodule update --remote --merge
git commit -am "Bump arcade-kit" src/arcade-kit && git push
```

`.gitmodules` sets `branch = main`, and `kit:bump` passes `--merge`, so the submodule stays on
`main` and stays editable. A plain `git submodule update` leaves it on a detached HEAD; if that
happens, `git -C src/arcade-kit checkout main` puts it back.

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

## One-time setup: putting this repo on GitHub

Until this repo is on GitHub, both sites point at it by local path
(`url = /Users/desaiwang/Documents/GitHub/arcade-kit` in their `.gitmodules`), which works
locally but **cannot be cloned by Vercel**. To finish the setup:

```bash
cd ~/Documents/GitHub/arcade-kit
gh repo create desaiwang/arcade-kit --public --source=. --remote=origin --push

# then in each site, point the submodule at GitHub and commit the change
cd ~/Documents/GitHub/portfolio-nextjs
git submodule set-url src/arcade-kit https://github.com/desaiwang/arcade-kit.git
git submodule sync src/arcade-kit
git commit -am "Point arcade-kit at GitHub" .gitmodules

cd ~/Documents/GitHub/desaimakes
git submodule set-url src/arcade-kit https://github.com/desaiwang/arcade-kit.git
git submodule sync src/arcade-kit
git commit -am "Point arcade-kit at GitHub" .gitmodules
```

Use the `https://` URL, not `git@github.com:…` — Vercel clones submodules over HTTPS.

Two notes about the local-path setup, both of which go away after the flip:

- Git refuses `file://` submodule fetches by default, so `git submodule update --remote` needs
  `-c protocol.file.allow=always`. Each site's `npm run kit:bump` already passes it; the flag is
  harmless over HTTPS, so the script keeps working afterwards.
- This checkout has `receive.denyCurrentBranch=updateInstead` set so the sites can push into it
  while it is the origin.

After the flip, `~/Documents/GitHub/arcade-kit` is just a spare clone — the copies that matter are
the ones inside each site.
