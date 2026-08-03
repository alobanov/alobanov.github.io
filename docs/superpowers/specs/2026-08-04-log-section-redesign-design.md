# LOG section redesign

Date: 2026-08-04
Status: approved for planning

## Problem

The LOG section (`site.logs`, 56 entries across `movie`, `game`, `music`, `location`) presents
each entry three ways — list, card, single page — and the list view is the weakest of the three.

Concrete defects:

1. `/logs/` has no rating column at all (`logs.md`) — only `#`, Title, Category, Date.
2. The external link (IMDb / OpenCritic / Google Maps) lives inside the markdown body, in the
   `### 🌊 [Title](url) / Verdict` heading. The list hides that heading via
   `.bm-content-body h3 { display: none }` (`assets/css/style.css:948`), so the link is
   unreachable from the list.
3. Rating renders as a bare digit with no scale (`logs/movie.html:57`).
4. Row click expands the note, but the title inside the row is an `<a>` to the entry page — two
   competing actions in one hit area (`assets/js/view_toggle.js:21`).
5. Verdict ("Masterpiece", "Excellent") and the 🔥 highlight marker are trapped in prose and
   unavailable to any view that isn't the full note.
6. The list table is copy-pasted in five files: `logs.md`, `logs/movie.html`, `logs/game.html`,
   `logs/music.html`, `logs/location.html`.
7. `_layouts/log.html` hardcodes `<h1>LOG/</h1>`, so a single entry page never shows its own
   title. It also carries a meaningless `permalink: /logs/` in the layout front matter.

Data defects found while surveying `_logs/`:

- 4 entries carry an emoji where a rating belongs: `rating: "🔥"` (Ghost of Yotei, The Phoenician
  Scheme), `rating: "🎮"` (Secret Level), `rating: "🧠"` (Severance).
- `rating` is quoted in some files (`"3"`) and bare in others (`3`); one value is `"3.5"`.
- Verdict typos on display: **Grate** (3), **Masterpice** (4), **Greate** (1).
- 🔥 is signalled inconsistently — leading icon in some entries, superscript in others.
- `_logs/2025-09-26-ghost-of-yotai-game-log .md` has a space in the filename.

## Decisions

| Question | Decision |
|---|---|
| Scope | Whole LOG section: list + cards + single entry page |
| Where metadata lives | Migrated into front matter by a one-time script |
| `### …` heading in body | Removed; all three views render the header from front matter |
| List row shape | Two-tier flex row, not a `<table>` |
| Sort / filter / search controls | None (YAGNI) — category tabs and Cards/List stay as they are |
| Verdict typos | Fixed during migration |
| List row shape (revised) | The familiar table, with column headers kept |

### Revision, 2026-08-04

A first implementation replaced the table with a two-tier flex list. It was
rejected in review: it dropped the column headers, changed the type, rounded the
hover highlight, applied that highlight to the title row only rather than the
whole entry, and pushed four extra fields into a row that had asked only for a
rating and a link.

The revised list keeps the table and its headers. The row carries `#`, title,
optional category, rating and date — nothing else. Verdict and tag move into the
opened note. The quality comes from execution rather than added fields:

- The rating column is fixed-width and right-aligned, so scanning down it the
  filled stars line up into the shape of a year's taste.
- Year headings stick to the top of the viewport while their year scrolls past.
- The note opens with a `grid-template-rows: 0fr → 1fr` transition instead of
  appearing instantly, and the caret rotates with it.
- Hover and the open state cover the whole entry — title row and note together —
  with square corners.
- The source link stays at half opacity until its row is hovered or focused.
- The open note is typeset as its own spread: a mono eyebrow carrying the
  verdict and tag, a hanging serif quote mark in the gutter, a 62ch measure,
  1.72 leading, the author's bold set in the rating amber, and the date and
  permalink in the footer.
- `prefers-reduced-motion` disables every transition above.

## Data model

```yaml
---
layout: log
title: "The Odyssey"
date: 2026-08-03
category: movie
rating: 5                    # number 0–5, step 0.5; absent for music/location
icon: "🌊"                   # optional; falls back to the category emoji
verdict: "Best film of the year"
tag: "IMAX"                  # optional, from the old superscript
highlight: true              # the old 🔥
link: https://www.imdb.com/title/tt33764258
link_label: IMDb             # optional override; derived from the domain by default
images:                      # unchanged
  - foo.jpeg
---

> Nolan takes the oldest story ever told…
```

Every field except `title`, `date`, `category` is optional. Views must render correctly when any
of them is missing — `music` entries have neither `rating` nor `link`.

`link_label` is derived in Liquid from the URL:

| URL contains | Label |
|---|---|
| `imdb.com` | IMDb |
| `opencritic.com` | OpenCritic |
| `maps.app.goo.gl`, `google.com/maps` | Maps |
| anything else | Link |

Icon fallback by category: `movie` 🎬, `game` 🍄, `location` 📍, `music` 🎵 — matching the
existing `_includes/emoji_category.html` mapping.

For `location` entries the fields map naturally: `verdict` holds the country (`🇮🇹 Italy`), `tag`
holds the region or note (`Sicily`).

## Components

Five near-identical copies of the list collapse into shared includes.

| File | Responsibility |
|---|---|
| `_includes/log_meta.html` | Given `log`, sets `icon`, `link_label`, normalized `rating` |
| `_includes/log_stars.html` | Renders a rating as stars; supports halves via a width overlay |
| `_includes/log_list.html` | The full list. Params: `items`, `show_category` |
| `_includes/log_card.html` | One card. Params: `item`, `index` |

`logs.md` and `logs/{movie,game,music,location}.html` shrink to page intro + two includes each.
`_includes/emoji_category.html` stays as-is; `log_meta.html` reuses it for the icon fallback.

## List view

```
2026 ─────────────────────────────────────────

 🌊  The Odyssey                  ★★★★★  03.08
     Best film of the year 🔥 · IMDb ↗

 🚀  Project Hail Mary            ★★★★☆  22.03
     One of the best · IMDb ↗
```

Markup:

```html
<ol class="log-list">
  <li class="log-year">2026</li>
  <li class="log-item">
    <div class="log-head" role="button" tabindex="0" aria-expanded="false">
      <span class="log-icon" aria-hidden="true">🌊</span>
      <span class="log-body">
        <span class="log-title">The Odyssey</span>
        <span class="log-sub">
          Best film of the year <span class="log-flame" title="Highlight">🔥</span>
          <span class="log-sep">·</span>
          <a class="log-ext" href="…" target="_blank" rel="noopener">IMDb ↗</a>
        </span>
      </span>
      <span class="log-rating" aria-label="5 out of 5">★★★★★</span>
      <span class="log-date">03.08</span>
    </div>
    <div class="log-note" hidden>
      …markdownified note…
      <a class="log-permalink" href="/logs/…">#38 · 3 August 2026 →</a>
    </div>
  </li>
</ol>
```

Click targets are separated so no two actions share a hit area:

| Target | Action |
|---|---|
| The row | Toggles the note |
| `IMDb ↗` | Opens the external site — `stopPropagation` on the anchor |
| `#38 · 3 August 2026 →` inside the open note | Navigates to the entry page |

The row is a `div[role="button"]`, not a `<button>` — a `<button>` may not contain an `<a>`.
JS handles `click` plus `keydown` on Enter/Space and keeps `aria-expanded` in sync. Stars carry
an `aria-label` because the glyphs alone are not an accessible rating.

Responsive: below 600px the date column drops (the full date is in the open note) and the rating
stays right-aligned.

The `music` and `location` pages pass no rating, so those rows show icon, title, sub-line and date.

## Cards

`log_card.html` renders the same header from the same fields, so a card and a row can never
disagree:

```
╭────────────────────────────────────────╮
│ 🌊 The Odyssey  ↗ IMDb          ★★★★★ │
│ Best film of the year  🔥              │
│                                        │
│ Nolan takes the oldest story ever told │
│ and turns it into something massive…   │
│                                        │
│ 🎬 Movie          #38 / 3 August 2026  │
╰────────────────────────────────────────╯
```

Images and the SoundCloud iframes in `music` entries render below the note exactly as today.

## Single entry page

`_layouts/log.html` is rewritten:

- `<h1>` shows the entry's icon and title, with the external link as a trailing `↗`.
- A meta line below it: category badge · date · stars · tag.
- Note, then images.
- Footer navigation: previous / next entry within the same category, plus "All logs".

The stray `permalink: /logs/` and `title: Logs` are removed from the layout front matter.

## Colour and theme

Stars get a new variable `--star-color: #c8963e` (warm amber) instead of reusing
`--secondary-color` (#267cb9), so a rating no longer reads as a link. Declared in `:root` and
overridden in the `[data-theme="dark"]` block alongside the existing variables. Every new rule
uses existing variables; no literal colours outside the `:root` blocks.

## Migration

A one-time Ruby script at `script/migrate_log_frontmatter.rb`:

- Idempotent — running it twice changes nothing; entries already migrated are skipped.
- `--dry-run` prints a unified diff without writing.
- Parses the first `### …` line of each entry into `icon`, `link`, `verdict`, `tag`, `highlight`,
  then deletes that line from the body.
- Superscript handling: a value matching `N/5` or `N.N/5` is dropped as redundant with `rating`;
  a bare 🔥 sets `highlight: true`; anything else becomes `tag`.
- 🔥 anywhere in the heading sets `highlight: true`; if 🔥 was the leading icon, `icon` is left
  unset and falls back to the category emoji.
- Normalizes `rating` to an unquoted number.
- Applies the agreed verdict typo fixes: Grate → Great, Masterpice → Masterpiece,
  Greate → Great. Authorial phrasings ("Damn! soo good", "Sorry Mr. Cruise", "It's OK") are
  untouched.

Known special cases the parser must handle:

| Entry | Peculiarity |
|---|---|
| Ghost of Yotei | Emoji inside the link text: `[⚔️ Ghost of Yotei](url)` |
| Secret Level | Two superscripts, one before the `/` separator |
| Exit (Serbia) | No `/` separator at all |
| The Killer | A second markdown link (soundtrack) later in the note — must not be picked up |
| `music` entries | No heading; only front matter and an iframe |

Ratings decided for the four emoji-valued entries:

| Entry | Rating | Also |
|---|---|---|
| Ghost of Yotei | 4.5 | `highlight: true` |
| The Phoenician Scheme | 5 | `highlight: true` |
| Severance | 5 | `highlight: true`, `tag: "🧠 A Mind-Bending Thriller"` |
| Secret Level | 4 | `highlight: true`, `tag: "🎮 Series"` |

`_logs/2025-09-26-ghost-of-yotai-game-log .md` is renamed via `git mv` to drop the space.

Data changes and code changes go in separate commits so either can be reverted alone.

## Verification

- `bundle exec jekyll build` succeeds with no warnings introduced.
- Entry count per category on each page matches the pre-migration count (56 total: 27 movie,
  11 game, 11 music, 7 location).
- Every entry that had an external link before still exposes one after (45 of 56).
- Rendered pages checked in a browser at desktop and 375px widths, in light and dark themes.
- Keyboard pass: Tab reaches every row, Enter/Space expands, the external link is reachable and
  does not expand the row.

## Out of scope

- Sorting, filtering, search.
- Posts, bookmarks, home page, header — the rest of the site keeps its current design.
- Poster/cover artwork for movies and games.
- Any change to `_bookmarks` or its list view.
