# Handoff: AutoMarket Homepage Redesign

## Overview

A complete visual redesign of the AutoMarket homepage — a car marketplace web app. The brief was to move from a busy/dated layout to something modern, premium, and restrained (Apple / Linear / Porsche.com territory) while keeping every existing feature. This handoff covers the **homepage only**. Other routes (Offers, Sell, etc.) will follow in subsequent design rounds.

---

## About the Design Files

The files in this bundle are **design references created in HTML/React/CSS** — interactive prototypes that show the intended look and behavior. They are **not production code to copy directly**.

The implementation task is to **recreate these designs in the target codebase** (React 19 + TypeScript + Vite + plain CSS + React Router v6) using the codebase's existing patterns, file structure, and conventions. Reuse the design tokens (CSS variables) and the visual language exactly; rewrite the component scaffolding to match how the existing app is organized.

### Files included

| File | What it is |
|---|---|
| `AutoMarket Redesign.html` | Entry point — opens the design canvas with all 4 viewport/theme artboards + system docs |
| `homepage.jsx` | The full homepage React tree (single file for prototype convenience) |
| `styles.css` | The complete design token system + all component styles (this is the canonical source for tokens) |
| `design-canvas.jsx` | The pan/zoom canvas chrome — **not part of the deliverable**, only used to present artboards |

To preview locally: open `AutoMarket Redesign.html` in a browser.

---

## Fidelity

**High-fidelity (hifi).** All colors, type sizes, spacing, radii, shadows, focus rings, motion durations, and interaction behaviors are final. Recreate pixel-perfectly. Imagery is intentionally left as striped placeholders — production should swap in real car photos with the same aspect ratios and corner labeling.

---

## Stack & Architecture (per original brief)

- **React 19** + **TypeScript** + **Vite**
- **Plain CSS** (no Tailwind, no UI library) — token values live in CSS custom properties scoped to a top-level `.am` class
- **React Router v6** — all navigation MUST be `<Link to="…">`, not `<a href="…">` (the prototype uses `<a href="#/…">` only because it's a static prototype)

### Existing routes to wire up

```
/, /offers, /sell, /my-listings, /help, /contact-us,
/login, /signup, /favorites, /car-details
```

### Suggested file layout in the real app

```
src/
  pages/
    Home/
      Home.tsx              ← page root
      Home.css              ← optional page-specific styles
  components/
    home/
      Hero.tsx
      SearchBar.tsx
      FilterModal.tsx
      BrandsRail.tsx
      ResultsSection.tsx
      PopularOffersSection.tsx
      CarCard.tsx
    layout/
      Navbar.tsx
      Footer.tsx
      MobileMenu.tsx
  hooks/
    useTypewriter.ts
    useFavorites.ts          ← persists Set<number> to localStorage
    useTheme.ts              ← whatever exists already
  styles/
    tokens.css               ← copy the :root, .am[data-theme="light|dark"] blocks from styles.css
    base.css                 ← reset + .am base
    components.css           ← OR split per-component
```

Drop the `data-theme` attribute on `<html>` or `<body>` (whatever the existing theme system uses) instead of `.am[data-theme="…"]` — the selectors collapse to the same thing.

---

## Screens / Views

The homepage is a single scrolling document, designed at four viewport × theme combinations: **Desktop Light**, **Desktop Dark** (1440×900), **Mobile Light**, **Mobile Dark** (390×844).

Sections in scroll order:

### 1. Navbar (sticky)

- **Container:** 64px tall desktop, 56px tall mobile. Background `color-mix(in oklab, var(--bg) 86%, transparent)` with `backdrop-filter: saturate(140%) blur(14px)`. Hairline bottom border (60% of `--border`). `position: sticky; top: 0; z-index: 50`.
- **Left:** Brand `<Link to="/">` — 22×22 rounded-6px black tile with monospace "A" + wordmark "AutoMarket" (Geist 500, 16px, tracking -0.02em).
- **Center (desktop):** Primary nav — Home, Offers, Sell, My listings, Help, Contact. Each is 8×12 padding, 14px Geist, color `--text-2`. Hover → `--text` + `--surface-2` bg. `aria-current="page"` adds a 1px underline 4px below the label.
- **Right:**
  - Theme toggle (sun ↔ moon icon, 36×36 icon button)
  - Favorites heart link → `/favorites` (same 36×36 button)
  - **Logged out:** "Log in" ghost button + "Sign up" primary button (dark fill)
  - **Logged in:** `Hi, {firstName}` text (14px, `--text-2`) + "Log out" outline button
- **Mobile:** Hamburger icon button replaces the auth area. Tapping opens a sheet below the navbar containing every link plus auth buttons (full-width pair at bottom).

### 2. Hero

- **Layout:** Two-column grid 1.15fr / 1fr, `gap: 64px`, `align-items: end`. Mobile collapses to single column.
- **Eyebrow:** Mono 12px uppercase tracking +0.04em, preceded by an 18×1px horizontal rule. Color `--muted`. Example: `VERIFIED MARKETPLACE · 2026`.
- **Headline:** Geist 500, 104px desktop / 80px tablet / 44px mobile, line-height 0.98, tracking -0.035em. Max 14ch. Text: `Find your perfect [WORD] today.` — the `[WORD]` cycles via typewriter through `car → deal → ride`, rendered italic in `--accent` with a blinking 1Hz caret (▍) after it.
- **Subtitle:** Geist 400, 18px (16px mobile), `--text-2`, max 44ch, `margin-top: 24px`. Copy: *"Browse 14,300+ verified listings from trusted private sellers and dealers. No fees, no clutter — just cars."*
- **CTAs:** Row of two large buttons (`height: 48px, padding: 0 22px, radius: 10px`).
  - Primary: dark fill (`--text` bg, `--bg` text), label "Browse cars" + right-arrow icon → `/offers`
  - Secondary: outline (1px `--border-strong`), label "Sell your car" → `/sell`
- **Stats row:** 4-column grid on desktop, 2×2 on mobile. Top border 1px `--border`, `padding-top: 24px`, `margin-top: 48px`. Each cell: mono 26px number (tracking -0.03em) + 13px label `--muted` below.
  - `14,300+` Cars listed
  - `6,800+` Verified sellers
  - `99%` Satisfaction rate
  - `Free` To browse
- **Right column (desktop only):** Hero visual = 4:5 aspect-ratio striped placeholder framed by 1px `--border` and 20px radius. Corner labels in mono ("Today on the lot" top-left; "Porsche · Taycan 4S · 2024" top-right with 21px price-style number). Bottom overlay: 4×2 grid of brand-name chips (Volkswagen, BMW, Mercedes, Audi, Porsche, Honda, Toyota, Skoda) — each chip is translucent `--surface` on backdrop-blur(6px), 1px border, 8px radius, 11px Geist.

### 3. Search bar (integrated into hero band)

- Sits inside the hero `<section>`, separated from the stats by a 1px `--border` top + 24px padding.
- **Capsule:** Full-width, 14px radius, 1px `--border-strong` border, white/`--surface` fill, `--shadow-1`, 6px internal padding. Single flex row, items:
  1. Search icon (18px, `--muted`)
  2. Free-text `<input>` — placeholder *"Search cars — e.g. Audi A6, SUV, diesel, 2018"*
  3. Clear (×) button — only shown when input has value, 28×28 circle ghost
  4. 1px×24px divider (hidden on mobile)
  5. **Filters button** — 38px tall, slider icon + "Filters" label (label hides on mobile) + active-count badge if `>0` (12px mono in `--accent` pill)
  6. **Search submit** — 38px tall, dark fill, 10px radius, label "Search"
- **Focus state:** Border → `--text`, plus 4px `--focus` ring. 220ms transition.
- **Below capsule:** When a query or filters are active, a right-aligned "Clear search & filters" text link (13px `--muted`, underline on hover).
- **On submit:** Smooth-scroll to the Results section.

### 4. Filters modal (opens from search bar)

- **Desktop:** Centered dialog, max-width 720px, max-height 88vh, 20px radius, `--shadow-2`, scrim is 50% black. Animates: scrim fade 220ms, panel pop (translateY 10px → 0, scale 0.98 → 1) 360ms.
- **Mobile:** Bottom sheet — full-width, full-height, top-only 20px radius, animates up 40px.
- **Head:** 16×24 padding, 1px bottom border. Title "Advanced filters" (18px, 500) + close × button.
- **Body:** 24px padding, scrolls if overflowing. Contains 4 named sections, each with a mono uppercase label (12px tracking 0.06em `--muted`) and a 3-column grid of fields (2-column on mobile):
  1. **Vehicle** — Brand (select), Model (select, dependent on Brand — disabled if no Brand picked), Body type (select)
  2. **Year & mileage** — Year range (From/To inputs), Mileage range km (Min/Max), Engine (text e.g. "2.0")
  3. **Drivetrain** — Fuel (select), Transmission (select), Drive type (select)
  4. **Price & specifics** — Price € range (Min/Max), Condition (select: New/Used), Color (select), Doors (select: 2/3/4/5)
- **Field styling:** 38px height, 1px `--border`, 6px radius, `--surface` bg. Focus → 1px `--text` border + 3px `--focus` ring.
- **Foot:** 16×24 padding, 1px top border. Reset (ghost, left) + Cancel (outline) + Apply filters (primary, dark fill, right).
- **Close behavior:** Outside click on scrim, Escape key, × button, Cancel button → close without applying. Apply commits + closes.

### 5. Brands rail

- Demoted from a full band to a quiet chip strip.
- Section padding `48px 0 24px`.
- **Head row:** Mono 12px uppercase "JUMP TO A BRAND" left, "All 42 brands →" text link right.
- **Chips:** Flex row, 8px gap, wraps on desktop. Each chip = 38px tall, pill radius, 16px horizontal padding, 1px `--border`, `--surface` bg, 13px Geist `--text-2`. Hover → `--text` + `--text-2` border.
- **Mobile:** Single-row horizontal scroll (`flex-wrap: nowrap; overflow-x: auto`), scrollbar hidden.
- **Brands shown:** BMW, Audi, Tesla, Toyota, Mercedes-Benz, Honda, Volkswagen, Ford. All chips → `/offers?brand=…`.

### 6. Search Results section (conditional)

- Mounts only when there's a submitted query OR ≥1 active filter.
- 64px top padding, 1px top border.
- **Head:** "Search results" h2 (44px desktop, 32px mobile, Geist 500, tracking -0.025em) + sub-line "X matches for `query` · N filters active" (14px `--muted`). Right side: "Clear" ghost button.
- **Body:** Same 3-column card grid as Popular. Empty state = single dashed-border card with text *"No results found for your search."*
- **Behavior:** On search submit, smooth-scroll this section into view.

### 7. Popular offers

- Section header same style as Results: "Popular offers" + sub "Hand-picked listings updated this week" + right-side "View all offers →" link to `/offers`.
- **Grid:** 3 columns desktop (24px gap), 1 column mobile (16px gap).
- **Bottom CTA:** Centered large primary button "View more →" to `/offers`, `margin-top: 48px`.

### CarCard component (used by Results + Popular)

- **Wrapper:** `<article role="link" tabIndex={0}>` — whole card is clickable + Enter/Space activates → `/car-details/:id` (real route). Focus ring 2px `--focus`.
- **Media (4:3):** 14px radius, 1px `--border`, `--surface` bg. On `:hover` (card), border shifts to `--text-2`.
  - Striped placeholder fill (production: real image, lazy loaded via `loading="lazy"`).
  - Top-left mono uppercase brand stamp (12px `--muted`).
  - Top-right: small "tag · year" cluster (21px mono number + 12px sub).
  - Bottom-left: tiny mono filename pill.
  - **Heart favorite button** absolute top-right: 36×36 circle, translucent `--surface` w/ blur, `--text-2` color. `aria-pressed` toggles to `--accent` + filled fill. `onClick={(e) => { e.stopPropagation(); toggleFav(); }}` — **must not** trigger card navigation.
- **Body:** 12px top padding.
  - Row 1: Title `{Brand} {Model}` (16px, 500) + year (16px, 400, `--muted`) on left; mono price `€42,800` right-aligned.
  - Row 2: Mono 12px `--muted` meta — `{mileage} · {engine} · {fuel} · {transmission}`.

### 8. Footer

- 64px top padding, 24px bottom, 1px top border.
- **Grid:** 4 columns desktop (1.4fr / 1fr / 1fr / 1.3fr, 48px gap). Mobile: 2 columns with Brand + Newsletter spanning both.
- **Brand col:** Wordmark + tagline (*"A calmer marketplace for buying and selling cars. Verified sellers, transparent listings, no upsells."*, 13px `--muted`, max 36ch) + 4 social icons in 32×32 outlined buttons (Facebook, Instagram, X, LinkedIn).
- **Explore col:** h4 "Explore" (13px, 500) + list — Browse cars / New arrivals / Electric vehicles / Luxury cars / SUVs & crossovers (all → `/offers`).
- **Company col:** h4 "Company" + list — About us / Sell your car (→ `/sell`) / Contact (→ `/contact-us`) / Help center (→ `/help`) / FAQ (→ `/help`).
- **Newsletter:** h4 "Stay in the loop" + 13px `--muted` line + inline input+button. Input + button share a single rounded container (6px radius, 1px `--border-strong`). Button is dark fill, 13px label "Subscribe".
- **Bottom bar:** 48px margin-top, 16px padding-top, 1px top border. Mono-12 `--muted` row: `© 2026 AutoMarket. All rights reserved.` on left; Privacy policy / Terms of service / Cookie settings on right. Wraps on small screens.

---

## Interactions & Behavior

| Element | Behavior |
|---|---|
| Typewriter | Cycles `["car", "deal", "ride"]`. 90ms per char type, 1400ms hold, 50ms per char erase, 200ms pause between words. Italic accent color + 1Hz blinking caret. Under `prefers-reduced-motion`, word stays static (no typing, no caret blink). |
| Theme toggle | Flips `data-theme` between `light` and `dark`. Persist to localStorage. No transition on the swap (intentional — instant). |
| Favorites | Toggle on heart click. Persist `Set<number>` to localStorage (key e.g. `automarket:favs`). Filled heart in `--accent` when favorited. |
| Search submit | `setSubmittedQuery(query)` then `resultsRef.scrollIntoView({ behavior: 'smooth', block: 'start' })`. |
| Search clear (×) | Visible only when input has value. Clears `query` only. |
| Filters button | Opens modal. Badge shows count of populated filter keys. |
| Modal outside-click | Mousedown on scrim (not the panel) closes without applying. |
| Modal Escape key | Closes without applying. |
| Modal Apply | Commits draft state → parent `filters`, closes modal. |
| Modal Reset | Clears local draft (does NOT commit until Apply). |
| "Clear search & filters" link | Clears both `query`/`submittedQuery` and `filters`. |
| Brand→Model dependency | Model select disabled with placeholder "Pick a brand" until Brand chosen; resets if Brand changes. |
| Card click | Navigates to `/car-details/:id`. Enter/Space on focused card same. |
| Card heart click | `e.stopPropagation()` — does not navigate. |
| Mobile menu | Hamburger toggles a sheet under navbar. Closes when any link tapped. |

---

## State Management

All local to the Home page (use `useState` + a couple of small custom hooks):

```ts
// Home page
const [query, setQuery]                   = useState("");
const [submittedQuery, setSubmittedQuery] = useState("");
const [filters, setFilters]               = useState<Filters>({});
const [filterOpen, setFilterOpen]         = useState(false);
const [mobOpen, setMobOpen]               = useState(false);
const { favs, toggleFav }                 = useFavorites();   // localStorage-backed
const { theme, toggle }                   = useTheme();       // app-wide; already exists
const word                                = useTypewriter(["car","deal","ride"]);

// Derived
const filterCount = useMemo(
  () => Object.values(filters).filter(Boolean).length,
  [filters]
);
const showResults = submittedQuery !== "" || filterCount > 0;
const results     = useMemo(() => runSearch(allCars, submittedQuery, filters), [submittedQuery, filters, allCars]);
```

**Filters type sketch:**
```ts
type Filters = Partial<{
  brand: string; model: string; body: string;
  yearFrom: string; yearTo: string;
  kmMin: string; kmMax: string; engine: string;
  fuel: string; transmission: string; drive: string;
  priceMin: string; priceMax: string;
  condition: "New" | "Used"; color: string; doors: string;
}>;
```

**Data fetching:** Out of scope for the visual redesign — wire the existing data layer to populate `allCars` (for Popular Offers + Results). Card grid should render skeletons of identical dimensions while loading (use a striped placeholder + greyed text rows). Pagination/infinite-scroll behavior to be defined in the Offers page round.

---

## Design Tokens

All tokens live in `styles.css` and are the source of truth. Copy the `:root`, `.am[data-theme="light"]`, and `.am[data-theme="dark"]` blocks verbatim into your `tokens.css`.

### Colors — Light

| Token | Value | Use |
|---|---|---|
| `--bg`            | `#f8f7f4` | Page background (warm off-white) |
| `--surface`       | `#ffffff` | Cards, inputs, modal head |
| `--surface-2`     | `#f1efe9` | Hover background, secondary surface |
| `--border`        | `#e5e2db` | Default hairlines |
| `--border-strong` | `#d3cfc5` | Inputs, search capsule |
| `--text`          | `#0c0c0b` | Primary text, buttons |
| `--text-2`        | `#3f3d38` | Body copy, nav links |
| `--muted`         | `#76736b` | Secondary text |
| `--muted-2`       | `#a09c92` | Placeholder text |
| `--accent`        | `oklch(0.62 0.14 40)` | Single brand accent (warm copper) |
| `--accent-2`      | `oklch(0.52 0.16 38)` | Accent hover |
| `--accent-fg`     | `#ffffff` | Text on accent fills |
| `--focus`         | `oklch(0.62 0.14 40 / .55)` | Focus rings |

### Colors — Dark

| Token | Value |
|---|---|
| `--bg`            | `#0c0c0b` |
| `--surface`       | `#141413` |
| `--surface-2`     | `#1c1c1a` |
| `--border`        | `#262624` |
| `--border-strong` | `#3a3a36` |
| `--text`          | `#f5f3ee` |
| `--text-2`        | `#c9c6bd` |
| `--muted`         | `#8b877d` |
| `--muted-2`       | `#5e5b54` |
| `--accent`        | `oklch(0.72 0.14 45)` |
| `--accent-2`      | `oklch(0.82 0.12 50)` |
| `--accent-fg`     | `#0c0c0b` |
| `--focus`         | `oklch(0.72 0.14 45 / .6)` |

### Type scale

| Token | px | Use |
|---|---|---|
| `--fs-12` | 12 | Mono labels, pills, footer bottom |
| `--fs-13` | 13 | Footer links, small UI |
| `--fs-14` | 14 | Buttons, nav links, body small |
| `--fs-15` | 15 | Body default |
| `--fs-16` | 16 | Card titles, brand wordmark |
| `--fs-18` | 18 | Hero subtitle, modal title |
| `--fs-21` | 21 | Placeholder spec numbers |
| `--fs-26` | 26 | Stat numbers |
| `--fs-32` | 32 | Section titles (mobile) |
| `--fs-44` | 44 | Section titles (desktop), hero (mobile) |
| `--fs-60` | 60 | reserved |
| `--fs-80` | 80 | Hero (tablet) |
| `--fs-104` | 104 | Hero (desktop) |

### Type families

- **Body:** `"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` — weights 300/400/500/600.
- **Mono:** `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace` — weights 400/500. Used for numerics, stat values, eyebrow/section labels, card meta lines, price, prices, code-style placeholder filenames.
- Load from Google Fonts: `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap`

### Spacing (8-step + a few odd values)

```
--sp-1: 4     --sp-2: 8     --sp-3: 12    --sp-4: 16
--sp-5: 24    --sp-6: 32    --sp-7: 48    --sp-8: 64
--sp-9: 96    --sp-10: 128
```

### Radii

```
--r-2: 4   --r-3: 6   --r-4: 10   --r-5: 14   --r-6: 20   --r-pill: 999px
```

### Shadows

```
--shadow-1: 0 1px 0 rgba(20,18,14,.04), 0 1px 3px rgba(20,18,14,.04)
--shadow-2: 0 6px 24px rgba(20,18,14,.06), 0 2px 6px rgba(20,18,14,.04)
```
Dark mode swaps to:
```
--shadow-1: 0 1px 0 rgba(0,0,0,.4)
--shadow-2: 0 8px 28px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3)
```

### Motion

```
--ease:  cubic-bezier(.2,.7,.2,1)
--dur-1: 120ms   (hover color/background)
--dur-2: 220ms   (focus rings, modal scrim fade, card border)
--dur-3: 360ms   (modal pop / sheet slide)
```

All animations + transitions collapse to `0.001ms` under `prefers-reduced-motion: reduce`. The typewriter caret stops blinking (opacity:1, animation:none).

---

## Accessibility checklist

- WCAG AA contrast on all text: body text ≥ 12:1 (light) / 14:1 (dark); muted text ≥ 4.6:1; accent on background ≥ 4.5:1.
- Every interactive element has a visible `:focus-visible` ring (2px solid `--focus`, 2px offset) — never `outline: 0` without a replacement.
- Card is `role="link" tabIndex={0}` with `aria-label` summarizing brand/model/year/price; Enter/Space trigger navigation; heart inside has its own `aria-pressed` + `aria-label`.
- Filter modal is `role="dialog" aria-modal="true"`. Add focus trap + focus return on close (the prototype doesn't trap — please add).
- Hamburger button has `aria-label`. The mobile sheet should add `aria-expanded` reflecting state.
- Theme toggle: `aria-label="Toggle theme"` and announce the current theme via `aria-pressed` or `title`.
- All icons are `aria-hidden="true"` because they're paired with labels or icon-button `aria-label`s.

---

## Assets

- **Fonts:** Geist + Geist Mono via Google Fonts (link in `<head>`).
- **Icons:** Hand-drawn inline SVGs (24×24 viewBox, 1.5px stroke). The prototype has 9 icons: Search, Close (×), Sun, Moon, Heart, Menu, Sliders (filters), ArrowRight, Plus. Match these — or substitute the existing icon library if the app already uses one (e.g. lucide-react). Sizes used: 14, 16, 18 px.
- **Social icons:** Inline SVGs for Facebook, Instagram, X, LinkedIn — also in `homepage.jsx` under `SOCIAL`.
- **Images:** Striped SVG placeholders only. Production should swap in real listing photos (4:3 aspect ratio) and the hero feature image (4:5 desktop, 4:3 mobile). The corner brand label and spec-number overlay in the hero visual are part of the design system — keep them or strip them; if kept, render them as text over the photo with a subtle gradient mask for legibility.
- **No real brand logos used.** Brand names (BMW, Audi, etc.) are rendered as plain text in Geist. If you want to add real logos, source licensed SVGs and ensure dark-mode variants.

---

## Responsive breakpoints

The prototype uses `data-vp="desktop|mobile"` to switch layouts. In production, replace with real CSS media queries:

| Breakpoint | Behavior |
|---|---|
| ≥ 1024px | Desktop layout (2-col hero, 3-col card grid, 4-col footer, primary nav visible, search bar full capsule) |
| 768–1023px | Tablet — collapse hero to single column, keep 2-col card grid, hide some footer columns |
| < 768px | Mobile — hamburger nav, vertical hero, 1-col cards, brand chips horizontal scroll, filter modal becomes bottom sheet, footer 2-col with spans |

(The prototype only ships desktop + mobile to keep options manageable; tablet behavior should interpolate.)

---

## What was intentionally trimmed (from the original spec)

- Decorative gradient blobs in the hero — gone, replaced by a single framed hero placeholder.
- Hero/brands/search no longer stack as three competing dense bands — search is now inside the hero band, brand chips are a quieter strip below.
- Cards trimmed to: image · favorite · title+year · price · single mono meta line. No badges/ribbons.
- One primary + one neutral scale (single warm copper accent). No second accent color.
- Footer dividers thinner, social icons smaller and outlined, link styling calmer.

---

## Open questions for the developer

1. **Theme toggle behavior** — fade or instant? Spec leaves this open; prototype is instant. Recommend instant.
2. **Hero visual on mobile** — currently hidden. Confirm whether you want it back as a smaller block under the headline, or stay hidden.
3. **Brand chip routes** — `/offers?brand=BMW` query param? Or path-based `/offers/bmw`? Pick whatever the Offers page round establishes.
4. **Search persistence** — should `query` survive navigation away/back? Currently component-local only.
5. **Skeletons** — loading state design not yet specified; use the same striped placeholder pattern as the prototype.

---

## Reference files in this bundle

- Open `AutoMarket Redesign.html` in a browser to interact with the live prototype.
- Read `styles.css` for the canonical token + class system — implementation should mirror this exactly.
- Read `homepage.jsx` for component behavior and structure — but reorganize into per-component files for the real app per the suggested file layout above.
