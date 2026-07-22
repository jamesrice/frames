# Frames — FT-Branded Film Prompt Builder

**Date:** 2026-07-22
**Status:** Approved
**Reference:** Interaction model studied from spellls.com/film/leica; all copy, descriptions, and imagery in this build are original.

## What we're building

A single-page, working prompt-builder web app in `frames/`. The user composes an image-generation prompt for a rangefinder/film-photography aesthetic by picking curated presets or manually selecting options across eight sections. Selections assemble live into a prompt in a right-hand rail, with copy/archive actions and localStorage persistence. Visuals follow the Fiction Tribe brand system, not the reference site's look.

## Scope

- **In:** One page — the builder. Header/nav rendered as visual chrome (links inert). Working accordion, preset bulk-apply, live prompt assembly, character counter with an optional character-cap mode, Draft/Archive tabs backed by localStorage.
- **Out:** Auth, backend, other pages (Worlds/Archive/Manual/Pricing as real routes), AI image generation, mobile app. Adding more "worlds" later is supported by the data schema but only one world ships.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`), ESLint 9 flat config — matching the conventions of the other projects in this collection. No router, no state library.

## Architecture

```
frames/
  src/
    data/world.ts        # The film world config: sections, fields, options, presets
    lib/assemble.ts      # Pure function: BuilderState -> prompt string
    lib/storage.ts       # localStorage load/save (draft + archive), try/catch wrapped
    components/
      Header.tsx         # FT logo + inert nav chrome
      Hero.tsx           # Eyebrow, world headline, subline
      ApproachPicker.tsx # Pre-Lit vs Manual Setup cards
      Accordion.tsx      # Numbered section shells (01–08); multiple sections may be open at once
      PresetGrid.tsx     # Preset cards w/ CSS placeholder tiles + spec strings
      OptionCardGrid.tsx # Selectable option cards (name + description)
      TextField.tsx      # Labeled textarea for scene fields
      PromptRail.tsx     # Sticky dark rail: Draft/Archive tabs, prompt, counter, actions
      ArchiveList.tsx    # Saved prompts: copy + delete
    App.tsx              # useReducer state + layout (left column + sticky rail)
```

### Data schema (`world.ts`)

- `World` = `{ id, name, eyebrow, subline, presets: Preset[], sections: Section[] }`
- `Section` = `{ id, number, title, subtitle, kind: 'presets' | 'text' | 'options', fields: Field[] }`
- `Field` (text kind) = `{ id, label, hint, placeholder }`
- `Field` (options kind) = `{ id, label, options: Option[] }`
- `Option` = `{ id, name, description, phrase }` — `phrase` is the fragment contributed to the prompt
- `Preset` = `{ id, name, specString, tileColor, selections: Record<fieldId, optionId> }`

Sections: 01 Presets · 02 The Scene (Subject / Environment / Action / Light & Atmosphere textareas) · 03 Human Moment · 04 Style · 05 Light · 06 Composition · 07 Camera (body / depth of field / film stock / grain) · 08 Time Machine (period / wardrobe / signage / vehicles / street life).

### State

```ts
BuilderState = {
  approach: 'prelit' | 'manual' | null,
  presetId: string | null,
  text: Record<fieldId, string>,
  selections: Record<fieldId, optionId | null>,
  capMode: boolean,            // character-cap toggle
  archive: ArchivedPrompt[],   // { id, name, prompt, savedAt }
}
```

`useReducer` in `App.tsx`. Choosing a preset dispatches a bulk-apply of that preset's `selections` (user can then adjust any field). Choosing Manual clears preset selection but keeps state. Every state change re-renders the assembled prompt and debounce-saves (300ms) the draft to localStorage. Reset settings clears draft state and storage.

### Prompt assembly (`assemble.ts`)

Pure function. Order: scene text fields first (non-empty only), then selected option phrases in section/field order. Fragments joined into flowing comma-separated prose with sentence-casing on the first fragment and a trailing period. Empty state returns `''`. Counter shows character count; when `capMode` is on, a cap constant (default 1024 chars) is displayed as `n / 1024` and overflow turns the counter red with an over-by count — never silent truncation.

## Visual design (FT brand)

- **Theme:** Light beige `#FEF7ED` page, `#131313` text. The prompt rail is a deliberate dark section (`#131313`), the "output terminal" of the tool. Footerless page; rail carries the dark weight.
- **Type:** Gilroy 400/500/700 (copied into project with tokens/fonts CSS from the FT brand repo). Space Mono for section numbers, eyebrows, field labels, counter. Headline is huge fluid Gilroy 700, -0.02em. No italics anywhere.
- **Color:** Purple `#4C00FF` as sole accent — selected cards, focus rings, hovers, active approach card. Coral→pink gradient allowed on 1–2 words of the rail's empty-state line only (dark bg). Preset placeholder tiles use FT content-card palette (aqua/blue/red/orange) as CSS tiles — no photography.
- **Components:** FT pill buttons (outline default, purple hover-fill) for Copy / Archive / Reset; FT card primitives for options/presets; 12-col grid, 1600px container, single column < 680px; hairline dividers between accordion rows.
- **Motion:** 0.25s ease; accordion open/close and prompt-fragment updates use `cubic-bezier(.13,.6,.23,.98)`. Respect `prefers-reduced-motion`.
- **Copy voice:** FT — punchline-first, short, confident. Light nod to the spell/incantation metaphor in the rail empty state; everything else plain-spoken. All copy original.

## Error handling & edge cases

- localStorage unavailable (private mode): storage functions no-op silently; app works session-only.
- Corrupt stored draft: parse in try/catch, fall back to initial state, overwrite on next save.
- Empty prompt: rail shows styled empty-state line; Copy/Archive buttons disabled.
- Cap overflow: visible over-limit state, no truncation.
- Long text in scene fields: textareas auto-grow; rail scrolls internally, page doesn't.

## Testing & verification

No test runner exists in this collection; keep `assemble.ts` and `storage.ts` pure/isolated so they're trivially testable if one is added. Verification is manual in-browser: preset bulk-apply, per-field override after preset, assembly order and punctuation, counter + cap states, persistence across refresh, archive add/copy/delete, responsive single-column layout, reduced-motion.

## Milestones

1. Scaffold (Vite + React + TS + Tailwind v4 + FT tokens/fonts) — `npm run dev` shows themed shell.
2. `world.ts` content + `assemble.ts` with full section/option data.
3. Left column: hero, approach picker, accordion with all field kinds.
4. Prompt rail: live assembly, counter, cap mode, copy.
5. Persistence + archive.
6. Polish pass: motion, focus states, responsive, reduced-motion.
