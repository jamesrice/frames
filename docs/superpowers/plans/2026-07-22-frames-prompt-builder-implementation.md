# Frames Prompt Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish `frames/` — a single-page FT-branded prompt builder for a rangefinder film-photography image-generation prompt, per `docs/superpowers/specs/2026-07-22-frames-prompt-builder-design.md`.

**Architecture:** Vite + React 19 + TypeScript SPA, no router/state library. A `World` data file (`src/data/world.ts`) drives everything — sections, fields, options, presets — so the accordion, option grids, and prompt assembly are rendered generically from data rather than hand-built per section. `useReducer` in `App.tsx` owns all builder state; a pure `assemble.ts` turns state into the prompt string; `storage.ts` persists draft + archive to `localStorage`, both wrapped in try/catch per the spec's error-handling rules.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9, Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme` config), ESLint 9 flat config with `typescript-eslint`. No test runner (matches every other project in this collection — see root `CLAUDE.md`); verification is `tsc -b`, `eslint .`, and manual browser QA, exactly as the spec's "Testing & verification" section prescribes.

## Global Constraints

- Single page only. Header/nav is visual chrome — links are inert, no routing.
- No auth, no backend, no AI image generation, no mobile app.
- All copy, descriptions, and imagery are original — no content copied from spellls.com/film/leica.
- Theme: light beige `#FEF7ED` page / `#131313` ink; prompt rail is dark `#131313`.
- Sole accent color: purple `#4C00FF`. Coral→pink gradient (`#F24A3D` → `#F9B8C2`) limited to 1–2 words of the rail's empty-state line only.
- Typography: Gilroy 400/500/700 for headings/body, Space Mono for section numbers/eyebrows/labels/counter. No italics.
- 12-col grid, 1600px container, single column below 680px.
- Motion: 0.25s ease, `cubic-bezier(.13,.6,.23,.98)` for accordion/prompt updates. Must respect `prefers-reduced-motion`.
- localStorage failures (private mode, corrupt data) must no-op / fall back silently — never throw, never truncate the prompt silently on cap overflow.
- No test runner is being introduced. `assemble.ts` and `storage.ts` must stay pure/isolated (no DOM reads beyond `localStorage`/`navigator.clipboard`) so they're trivially testable later.
- Repo: `jamesrice/frames` on GitHub (personal account — matches `magical-mystery-tour`, `drops-adventure` convention, not the `fictiontribe` org). Deploy: Cloudflare Pages, project name `frames`.

---

## File Structure

```
frames/
  index.html
  package.json, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json, eslint.config.js, .gitignore
  public/fonts/Gilroy-{Regular,Medium,Bold}.{woff,woff2}
  src/
    main.tsx, vite-env.d.ts, index.css
    styles/fonts.css
    data/world.ts          # types + WORLD constant (sections, fields, options, presets)
    lib/assemble.ts         # pure BuilderState -> prompt string
    lib/storage.ts          # localStorage load/save, types: Approach, DraftPayload, ArchivedPrompt
    components/
      Header.tsx
      Hero.tsx
      ApproachPicker.tsx
      Accordion.tsx
      PresetGrid.tsx
      TextField.tsx
      OptionCardGrid.tsx
      PromptRail.tsx
      ArchiveList.tsx
    App.tsx                 # reducer + layout
```

---

### Task 1: Scaffold (Vite + React + TS + Tailwind v4 + FT fonts)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `index.html`, `.gitignore`
- Create: `src/main.tsx`, `src/vite-env.d.ts`, `src/App.tsx` (placeholder shell), `src/index.css`, `src/styles/fonts.css`
- Copy: `public/fonts/Gilroy-Regular.woff2`, `.woff`, `Gilroy-Medium.woff2`, `.woff`, `Gilroy-Bold.woff2`, `.woff` from `/Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/`

**Interfaces:**
- Produces: Tailwind theme tokens usable as utility classes in every later task — `bg-ft-beige`, `text-ft-ink`, `bg-ft-purple`/`text-ft-purple`/`border-ft-purple`, `bg-ft-aqua`, `bg-ft-blue`, `bg-ft-red`, `bg-ft-orange`, `font-gilroy`, `font-mono`, `ease-ft` (custom `cubic-bezier(.13,.6,.23,.98)` timing function). All support Tailwind's `/opacity` modifier (e.g. `border-ft-ink/10`).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "frames",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "deploy": "vite build && wrangler pages deploy dist --project-name frames"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.2.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "tailwindcss": "^4.2.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.3",
    "vite": "^7.3.1",
    "wrangler": "^4.68.1"
  }
}
```

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: Write `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Write `eslint.config.js`**

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

- [ ] **Step 7: Write `.gitignore`**

```
node_modules
dist
dist-ssr
*.local
.DS_Store
.wrangler
.claude
```

- [ ] **Step 8: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Frames — Rangefinder Prompt Builder</title>
    <meta
      name="description"
      content="Build image-generation prompts for a rangefinder film-photography aesthetic. Curated presets or full manual control, assembled live."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Copy Gilroy font files**

```bash
mkdir -p /Users/jamesrice/dev-projects/frames/public/fonts
cp /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Regular.woff2 \
   /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Regular.woff \
   /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Medium.woff2 \
   /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Medium.woff \
   /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Bold.woff2 \
   /Users/jamesrice/dev-projects/fictiontribe-agents-md-main/fonts/Gilroy-Bold.woff \
   /Users/jamesrice/dev-projects/frames/public/fonts/
```

- [ ] **Step 10: Write `src/styles/fonts.css`**

```css
@font-face {
  font-family: 'Gilroy';
  src:
    url('/fonts/Gilroy-Regular.woff2') format('woff2'),
    url('/fonts/Gilroy-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src:
    url('/fonts/Gilroy-Medium.woff2') format('woff2'),
    url('/fonts/Gilroy-Medium.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src:
    url('/fonts/Gilroy-Bold.woff2') format('woff2'),
    url('/fonts/Gilroy-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 11: Write `src/index.css`**

```css
@import "tailwindcss";
@import "./styles/fonts.css";

@theme {
  --color-ft-beige: #FEF7ED;
  --color-ft-ink: #131313;
  --color-ft-purple: #4C00FF;
  --color-ft-aqua: #278DD8;
  --color-ft-blue: #3680F6;
  --color-ft-red: #FF562F;
  --color-ft-orange: #D99A01;

  --font-gilroy: 'Gilroy', 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Space Mono', monospace;

  --ease-ft: cubic-bezier(0.13, 0.6, 0.23, 0.98);
}

@layer base {
  body {
    background-color: var(--color-ft-beige);
    color: var(--color-ft-ink);
    font-family: var(--font-gilroy);
    -webkit-font-smoothing: antialiased;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 12: Write `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 13: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 14: Write placeholder `src/App.tsx`**

```tsx
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ft-beige text-ft-ink">
      <h1 className="font-gilroy text-4xl font-bold">Frames</h1>
    </div>
  )
}
```

- [ ] **Step 15: Install and verify**

```bash
cd /Users/jamesrice/dev-projects/frames
npm install
npm run build
npm run lint
```

Expected: both commands exit 0.

- [ ] **Step 16: Verify in browser**

Start the dev server (`npm run dev` via the preview tool) and confirm: beige background, "Frames" heading rendered in Gilroy bold, no console errors.

- [ ] **Step 17: Commit**

```bash
cd /Users/jamesrice/dev-projects/frames
git add package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js .gitignore index.html public src
git commit -m "Scaffold Vite + React + TS + Tailwind v4 with FT fonts/tokens"
```

---

### Task 2: World data (`src/data/world.ts`)

**Files:**
- Create: `src/data/world.ts`

**Interfaces:**
- Consumes: nothing (leaf data module).
- Produces: `World`, `Section`, `Field`, `TextField`, `OptionsField`, `Option`, `Preset` types; `WORLD: World` constant. Every later task imports from here.

- [ ] **Step 1: Write `src/data/world.ts`**

```ts
export interface Option {
  id: string
  name: string
  description: string
  phrase: string
}

export interface TextField {
  kind: 'text'
  id: string
  label: string
  hint: string
  placeholder: string
}

export interface OptionsField {
  kind: 'options'
  id: string
  label: string
  options: Option[]
}

export type Field = TextField | OptionsField

export type SectionKind = 'presets' | 'text' | 'options'

export interface Section {
  id: string
  number: string
  title: string
  subtitle: string
  kind: SectionKind
  fields: Field[]
}

export interface Preset {
  id: string
  name: string
  specString: string
  tileColor: 'aqua' | 'blue' | 'red' | 'orange'
  selections: Record<string, string>
}

export interface World {
  id: string
  name: string
  eyebrow: string
  subline: string
  presets: Preset[]
  sections: Section[]
}

export const WORLD: World = {
  id: 'rangefinder-city',
  name: 'The Rangefinder City',
  eyebrow: 'World 01 — Rangefinder',
  subline:
    'Grain, glass, and the hour before the light goes. Build a prompt for photographs that feel remembered, not staged.',
  presets: [
    {
      id: 'golden-hour-portrait',
      name: 'Golden Hour Portrait',
      specString: 'Leica M6 · f/2.8 · Portra 400',
      tileColor: 'aqua',
      selections: {
        humanMoment: 'caught-mid-laugh',
        style: 'documentary-realism',
        light: 'golden-hour-spill',
        composition: 'rule-of-thirds',
        cameraBody: 'leica-m6',
        depthOfField: 'shallow-f2-8',
        filmStock: 'portra-400',
        grain: 'fine',
      },
    },
    {
      id: 'neon-noir-street',
      name: 'Neon Noir Street',
      specString: 'Contax T2 · f/2.8 · Cinestill 800T',
      tileColor: 'blue',
      selections: {
        humanMoment: 'stolen-glance',
        style: 'high-contrast-noir',
        light: 'neon-wet-street',
        composition: 'leading-lines',
        cameraBody: 'contax-t2',
        depthOfField: 'shallow-f2-8',
        filmStock: 'cinestill-800t',
        grain: 'pronounced',
      },
    },
    {
      id: 'sun-bleached-memory',
      name: 'Sun-Bleached Memory',
      specString: 'Nikon FM2 · f/5.6 · Superia 400',
      tileColor: 'orange',
      selections: {
        humanMoment: 'walking-away',
        style: 'sun-bleached-nostalgia',
        light: 'hard-midday-sun',
        composition: 'negative-space-left',
        cameraBody: 'nikon-fm2',
        depthOfField: 'balanced-f5-6',
        filmStock: 'fuji-superia-400',
        grain: 'clean',
      },
    },
    {
      id: 'editorial-quiet',
      name: 'Editorial Quiet',
      specString: 'Hasselblad 500C · f/5.6 · Tri-X 400',
      tileColor: 'red',
      selections: {
        humanMoment: 'quiet-aside',
        style: 'muted-editorial',
        light: 'window-light-portrait',
        composition: 'frame-within-a-frame',
        cameraBody: 'hasselblad-500c',
        depthOfField: 'balanced-f5-6',
        filmStock: 'tri-x-400',
        grain: 'fine',
      },
    },
    {
      id: 'verite-handheld',
      name: 'Vérité Handheld',
      specString: 'Leica M6 · f/1.4 · HP5 Plus',
      tileColor: 'aqua',
      selections: {
        humanMoment: 'caught-mid-laugh',
        style: 'grainy-verite',
        light: 'practical-bulb-glow',
        composition: 'dead-center-symmetry',
        cameraBody: 'leica-m6',
        depthOfField: 'wide-open-f1-4',
        filmStock: 'ilford-hp5-plus',
        grain: 'heavy-push',
      },
    },
    {
      id: 'cinematic-wide',
      name: 'Cinematic Wide',
      specString: 'Pentax 67 · f/11 · Portra 400',
      tileColor: 'blue',
      selections: {
        humanMoment: 'lit-by-a-match',
        style: 'cinematic-wide',
        light: 'overcast-softbox',
        composition: 'low-angle-hero',
        cameraBody: 'pentax-67',
        depthOfField: 'deep-focus-f11',
        filmStock: 'portra-400',
        grain: 'clean',
      },
    },
  ],
  sections: [
    {
      id: 'presets',
      number: '01',
      title: 'Presets',
      subtitle: 'Start from a look someone already dialed in.',
      kind: 'presets',
      fields: [],
    },
    {
      id: 'scene',
      number: '02',
      title: 'The Scene',
      subtitle: 'What is actually happening in the frame.',
      kind: 'text',
      fields: [
        {
          kind: 'text',
          id: 'subject',
          label: 'Subject',
          hint: 'Who or what the frame is about.',
          placeholder: 'A woman in a raincoat, a corner newsstand, a parked motorcycle…',
        },
        {
          kind: 'text',
          id: 'environment',
          label: 'Environment',
          hint: 'Where this is happening.',
          placeholder: 'A narrow street between tenement buildings, wet asphalt…',
        },
        {
          kind: 'text',
          id: 'action',
          label: 'Action',
          hint: 'What is happening, mid-motion.',
          placeholder: 'Lighting a cigarette under an awning, glancing back over one shoulder…',
        },
        {
          kind: 'text',
          id: 'lightAtmosphere',
          label: 'Light & Atmosphere',
          hint: 'The mood the light is carrying.',
          placeholder: 'Streetlight haloed in fog, the last color before the sun drops…',
        },
      ],
    },
    {
      id: 'human-moment',
      number: '03',
      title: 'Human Moment',
      subtitle: 'The gesture that makes it feel real.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'humanMoment',
          label: 'Human Moment',
          options: [
            { id: 'caught-mid-laugh', name: 'Caught Mid-Laugh', description: 'A real laugh, not a posed one — head tipped back, eyes creased.', phrase: 'subject caught mid-laugh, head tipped back, unguarded' },
            { id: 'quiet-aside', name: 'Quiet Aside', description: 'Two people leaning in close, a private word passed between them.', phrase: 'a quiet aside between two figures, heads bent close together' },
            { id: 'stolen-glance', name: 'Stolen Glance', description: 'Eyes cutting sideways toward something off-frame.', phrase: 'a stolen glance toward something just outside the frame' },
            { id: 'walking-away', name: 'Walking Away', description: 'Back to the camera, mid-stride, going somewhere you will never see.', phrase: 'subject walking away mid-stride, back to the camera' },
            { id: 'hand-on-the-glass', name: 'Hand on the Glass', description: 'A hand pressed flat against a window, waiting for someone.', phrase: 'a hand pressed flat against glass, someone waiting' },
            { id: 'lit-by-a-match', name: 'Lit by a Match', description: 'A face lit only by the flare of a struck match.', phrase: 'a face lit only by the flare of a struck match' },
          ],
        },
      ],
    },
    {
      id: 'style',
      number: '04',
      title: 'Style',
      subtitle: 'The overall photographic treatment.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'style',
          label: 'Style',
          options: [
            { id: 'documentary-realism', name: 'Documentary Realism', description: 'Unposed, observational, nothing arranged for the camera.', phrase: 'documentary realism, unposed and observational' },
            { id: 'high-contrast-noir', name: 'High-Contrast Noir', description: 'Deep blacks, blown highlights, shadows doing the storytelling.', phrase: 'high-contrast noir styling, deep blacks and blown highlights' },
            { id: 'sun-bleached-nostalgia', name: 'Sun-Bleached Nostalgia', description: 'Faded color, soft edges, a memory more than a photograph.', phrase: 'sun-bleached nostalgic color grading, faded and soft-edged' },
            { id: 'muted-editorial', name: 'Muted Editorial', description: 'Restrained palette, magazine-clean, quietly composed.', phrase: 'muted editorial styling, restrained and quietly composed' },
            { id: 'grainy-verite', name: 'Grainy Vérité', description: 'Handheld energy, visible grain, caught rather than captured.', phrase: 'grainy vérité style, handheld and unpolished' },
            { id: 'cinematic-wide', name: 'Cinematic Wide', description: 'Anamorphic proportions, scope aspect, a frame built for a bigger screen.', phrase: 'cinematic wide framing with anamorphic-style proportions' },
          ],
        },
      ],
    },
    {
      id: 'light',
      number: '05',
      title: 'Light',
      subtitle: 'Where the light is coming from and how hard it hits.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'light',
          label: 'Light',
          options: [
            { id: 'golden-hour-spill', name: 'Golden Hour Spill', description: 'Low sun pouring in sideways, everything rimmed in warmth.', phrase: 'golden hour light spilling in low and warm' },
            { id: 'hard-midday-sun', name: 'Hard Midday Sun', description: 'Short shadows, bleached highlights, no mercy.', phrase: 'hard midday sun with short shadows and bleached highlights' },
            { id: 'neon-wet-street', name: 'Neon Wet Street', description: 'Signage bleeding color into rain-slicked pavement.', phrase: 'neon signage bleeding color across a wet street' },
            { id: 'window-light-portrait', name: 'Window Light Portrait', description: 'Soft directional light off to one side, the rest falling to shadow.', phrase: 'soft window light falling from one side' },
            { id: 'overcast-softbox', name: 'Overcast Softbox', description: 'The whole sky as one giant diffuser.', phrase: 'even, overcast light acting as a natural softbox' },
            { id: 'practical-bulb-glow', name: 'Practical Bulb Glow', description: 'A bare bulb or table lamp doing all the work.', phrase: 'warm practical bulb glow as the only light source' },
          ],
        },
      ],
    },
    {
      id: 'composition',
      number: '06',
      title: 'Composition',
      subtitle: 'How the frame is built.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'composition',
          label: 'Composition',
          options: [
            { id: 'rule-of-thirds', name: 'Rule of Thirds', description: 'Subject off-center, breathing room on the open side.', phrase: 'rule-of-thirds composition with subject off-center' },
            { id: 'dead-center-symmetry', name: 'Dead Center Symmetry', description: 'Subject locked in the middle, everything else in balance around it.', phrase: 'dead-center symmetrical composition' },
            { id: 'negative-space-left', name: 'Negative Space Left', description: 'The subject small, the empty half of the frame doing the talking.', phrase: 'generous negative space to the left of the subject' },
            { id: 'leading-lines', name: 'Leading Lines', description: 'Architecture or road pulling the eye straight to the subject.', phrase: 'leading lines drawing the eye toward the subject' },
            { id: 'frame-within-a-frame', name: 'Frame Within a Frame', description: 'Shot through a doorway, window, or arch.', phrase: 'framed within a doorway or window, a frame within the frame' },
            { id: 'low-angle-hero', name: 'Low Angle Hero', description: 'Camera low, subject looming large against the sky.', phrase: 'low-angle hero framing, subject looming against the sky' },
          ],
        },
      ],
    },
    {
      id: 'camera',
      number: '07',
      title: 'Camera',
      subtitle: 'The gear behind the frame.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'cameraBody',
          label: 'Camera Body',
          options: [
            { id: 'leica-m6', name: 'Leica M6', description: 'Rangefinder classic, quiet shutter, 35mm framing.', phrase: 'shot on a Leica M6 rangefinder' },
            { id: 'contax-t2', name: 'Contax T2', description: 'Pocketable, razor-sharp Zeiss glass.', phrase: 'shot on a Contax T2 point-and-shoot' },
            { id: 'nikon-fm2', name: 'Nikon FM2', description: 'Fully mechanical SLR, built for the long haul.', phrase: 'shot on a Nikon FM2 SLR' },
            { id: 'hasselblad-500c', name: 'Hasselblad 500C', description: 'Square medium format, waist-level and deliberate.', phrase: 'shot on a Hasselblad 500C medium format camera' },
            { id: 'pentax-67', name: 'Pentax 67', description: 'Medium format with the handling of a 35mm SLR.', phrase: 'shot on a Pentax 67 medium format camera' },
          ],
        },
        {
          kind: 'options',
          id: 'depthOfField',
          label: 'Depth of Field',
          options: [
            { id: 'wide-open-f1-4', name: 'Wide Open f/1.4', description: 'Razor-thin focus, the background dissolves.', phrase: 'shot wide open at f/1.4 with razor-thin depth of field' },
            { id: 'shallow-f2-8', name: 'Shallow f/2.8', description: 'Subject sharp, background softly falling away.', phrase: 'shallow depth of field at f/2.8' },
            { id: 'balanced-f5-6', name: 'Balanced f/5.6', description: 'Enough sharpness to hold the scene together.', phrase: 'balanced depth of field at f/5.6' },
            { id: 'deep-focus-f11', name: 'Deep Focus f/11', description: 'Foreground to background, all of it sharp.', phrase: 'deep focus at f/11, sharp from foreground to background' },
          ],
        },
        {
          kind: 'options',
          id: 'filmStock',
          label: 'Film Stock',
          options: [
            { id: 'portra-400', name: 'Kodak Portra 400', description: 'Warm skin tones, gentle color.', phrase: 'on Kodak Portra 400 film stock' },
            { id: 'tri-x-400', name: 'Kodak Tri-X 400 B&W', description: 'Punchy black and white with real grit.', phrase: 'on Kodak Tri-X 400 black and white film' },
            { id: 'fuji-superia-400', name: 'Fuji Superia 400', description: 'Cool greens, everyday color.', phrase: 'on Fuji Superia 400 film stock' },
            { id: 'cinestill-800t', name: 'Cinestill 800T', description: 'Tungsten-balanced, halated neon.', phrase: 'on Cinestill 800T film with characteristic halation' },
            { id: 'ilford-hp5-plus', name: 'Ilford HP5 Plus', description: 'Classic monochrome workhorse.', phrase: 'on Ilford HP5 Plus black and white film' },
          ],
        },
        {
          kind: 'options',
          id: 'grain',
          label: 'Grain',
          options: [
            { id: 'clean', name: 'Clean', description: 'Minimal grain, smooth tonal range.', phrase: 'clean, minimal film grain' },
            { id: 'fine', name: 'Fine', description: 'Just enough texture to read as film.', phrase: 'fine film grain' },
            { id: 'pronounced', name: 'Pronounced', description: 'Visible grain structure throughout.', phrase: 'pronounced, visible film grain' },
            { id: 'heavy-push', name: 'Heavy Push', description: 'Pushed a stop or two, grain doing heavy lifting.', phrase: 'heavy, pushed-stock film grain' },
          ],
        },
      ],
    },
    {
      id: 'time-machine',
      number: '08',
      title: 'Time Machine',
      subtitle: 'Dress the era, if this frame lives somewhere other than now.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'period',
          label: 'Period',
          options: [
            { id: '1960s', name: '1960s', description: 'Mod cuts, optimism, clean lines.', phrase: 'set in the 1960s' },
            { id: '1970s', name: '1970s', description: 'Earth tones, long collars, analog warmth.', phrase: 'set in the 1970s' },
            { id: '1980s', name: '1980s', description: 'Bold color, big shapes, neon ambition.', phrase: 'set in the 1980s' },
            { id: '1990s', name: '1990s', description: 'Grunge, minimalism, the last analog decade.', phrase: 'set in the 1990s' },
            { id: 'y2k', name: 'Turn of the Millennium', description: 'Y2K optimism, chrome and gel pens.', phrase: 'set at the turn of the millennium' },
            { id: 'present-day', name: 'Present Day', description: 'Now, exactly as it is.', phrase: 'set in the present day' },
          ],
        },
        {
          kind: 'options',
          id: 'wardrobe',
          label: 'Wardrobe',
          options: [
            { id: 'tailored-vintage', name: 'Tailored Vintage', description: 'Structured cuts and period fabric, nothing off the rack.', phrase: 'wearing tailored vintage clothing' },
            { id: 'workwear', name: 'Workwear', description: 'Denim, canvas, boots built for a shift.', phrase: 'dressed in period workwear' },
            { id: 'eveningwear', name: 'Eveningwear', description: 'Dressed for a night that matters.', phrase: 'dressed in eveningwear' },
            { id: 'streetwear', name: 'Streetwear', description: 'Whatever the block was actually wearing.', phrase: 'dressed in period-accurate streetwear' },
            { id: 'uniform', name: 'Uniform', description: 'A job you can identify at a glance.', phrase: 'wearing a uniform appropriate to the period' },
          ],
        },
        {
          kind: 'options',
          id: 'signage',
          label: 'Signage',
          options: [
            { id: 'hand-painted-storefronts', name: 'Hand-Painted Storefronts', description: 'Lettering done by hand, no two signs matching.', phrase: 'hand-painted storefront signage in the background' },
            { id: 'neon-marquee', name: 'Neon Marquee', description: 'Tube light spelling out a name in the dark.', phrase: 'a neon marquee sign glowing in the background' },
            { id: 'analog-billboards', name: 'Analog Billboards', description: 'Painted or pasted, towering over the street.', phrase: 'analog painted billboards in the background' },
            { id: 'minimal-modern', name: 'Minimal Modern', description: 'Clean type, negative space, nothing shouting.', phrase: 'minimal modern signage in the background' },
          ],
        },
        {
          kind: 'options',
          id: 'vehicles',
          label: 'Vehicles',
          options: [
            { id: 'classic-sedans', name: 'Classic Sedans', description: 'Chrome bumpers and long hoods parked at the curb.', phrase: 'classic sedans parked along the street' },
            { id: 'motorcycles', name: 'Motorcycles', description: 'Something with an engine, leaned on a kickstand.', phrase: 'a motorcycle in frame' },
            { id: 'taxis-and-cabs', name: 'Taxis & Cabs', description: 'A cab idling, meter running, going nowhere yet.', phrase: 'a taxi cab in frame' },
            { id: 'none-in-frame', name: 'None in Frame', description: 'Nothing with wheels — keep the street to the people.', phrase: 'no vehicles in frame' },
          ],
        },
        {
          kind: 'options',
          id: 'streetLife',
          label: 'Street Life',
          options: [
            { id: 'empty-and-quiet', name: 'Empty & Quiet', description: 'The street belongs to just this one moment.', phrase: 'an empty, quiet street' },
            { id: 'bustling-crowd', name: 'Bustling Crowd', description: 'Bodies moving in every direction, none of them posing.', phrase: 'a bustling crowd filling the street' },
            { id: 'market-stalls', name: 'Market Stalls', description: 'Awnings, crates, the noise of people selling things.', phrase: 'market stalls lining the street' },
            { id: 'rain-slicked-and-sparse', name: 'Rain-Slicked & Sparse', description: 'A few figures, the rest left to reflection.', phrase: 'a rain-slicked, sparsely populated street' },
            { id: 'late-night-solitary', name: 'Late-Night Solitary', description: 'One person, one street, everyone else asleep.', phrase: 'a late-night, solitary street scene' },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/jamesrice/dev-projects/frames
npx tsc -b --noEmit 2>&1 | head -50
npx eslint src/data/world.ts
```

Expected: no errors from either command.

- [ ] **Step 3: Commit**

```bash
git add src/data/world.ts
git commit -m "Add world.ts: full section/option/preset content for the Rangefinder world"
```

---

### Task 3: Prompt assembly (`src/lib/assemble.ts`)

**Files:**
- Create: `src/lib/assemble.ts`

**Interfaces:**
- Consumes: `WORLD` from `../data/world`.
- Produces: `assemblePrompt(input: AssembleInput): string`, `AssembleInput = { text: Record<string, string>; selections: Record<string, string | null> }`. Used by `App.tsx` (Task 5) and exercised live by `PromptRail` (Task 11).

- [ ] **Step 1: Write `src/lib/assemble.ts`**

```ts
import { WORLD } from '../data/world'

export interface AssembleInput {
  text: Record<string, string>
  selections: Record<string, string | null>
}

const TEXT_FIELD_ORDER = ['subject', 'environment', 'action', 'lightAtmosphere']

export function assemblePrompt({ text, selections }: AssembleInput): string {
  const fragments: string[] = []

  for (const fieldId of TEXT_FIELD_ORDER) {
    const value = text[fieldId]?.trim()
    if (value) fragments.push(value)
  }

  for (const section of WORLD.sections) {
    if (section.kind !== 'options') continue
    for (const field of section.fields) {
      if (field.kind !== 'options') continue
      const optionId = selections[field.id]
      if (!optionId) continue
      const option = field.options.find((candidate) => candidate.id === optionId)
      if (option) fragments.push(option.phrase)
    }
  }

  if (fragments.length === 0) return ''

  const [first, ...rest] = fragments
  const sentenceCased = first.charAt(0).toUpperCase() + first.slice(1)
  const prose = [sentenceCased, ...rest].join(', ')
  return prose.endsWith('.') ? prose : `${prose}.`
}
```

- [ ] **Step 2: Type-check and smoke-test**

```bash
cd /Users/jamesrice/dev-projects/frames
npx tsc -b --noEmit
npx eslint src/lib/assemble.ts
node --experimental-strip-types -e "
import('./src/lib/assemble.ts').then(({ assemblePrompt }) => {
  const empty = assemblePrompt({ text: {}, selections: {} })
  console.assert(empty === '', 'empty state should return empty string, got: ' + JSON.stringify(empty))

  const withData = assemblePrompt({
    text: { subject: 'a lone cyclist', environment: '', action: '', lightAtmosphere: '' },
    selections: { humanMoment: 'walking-away', style: null, light: null, composition: null },
  })
  console.assert(
    withData === 'A lone cyclist, subject walking away mid-stride, back to the camera.',
    'unexpected assembly: ' + withData,
  )
  console.log('assemble.ts smoke test passed')
})
"
```

Expected: `assemble.ts smoke test passed` with no assertion failures printed.

- [ ] **Step 3: Commit**

```bash
git add src/lib/assemble.ts
git commit -m "Add pure assemble.ts: BuilderState -> prompt string"
```

---

### Task 4: Persistence (`src/lib/storage.ts`)

**Files:**
- Create: `src/lib/storage.ts`

**Interfaces:**
- Consumes: nothing (leaf module besides `window.localStorage`).
- Produces: types `Approach`, `DraftPayload`, `ArchivedPrompt`; functions `loadDraft()`, `saveDraft(draft)`, `clearDraft()`, `loadArchive()`, `saveArchive(archive)`. Used by `App.tsx` (Task 5) for hydration/persistence and by `ApproachPicker`/`PromptRail`/`ArchiveList` for their prop types.

- [ ] **Step 1: Write `src/lib/storage.ts`**

```ts
export type Approach = 'prelit' | 'manual'

export interface DraftPayload {
  approach: Approach | null
  presetId: string | null
  text: Record<string, string>
  selections: Record<string, string | null>
  capMode: boolean
}

export interface ArchivedPrompt {
  id: string
  name: string
  prompt: string
  savedAt: number
}

const DRAFT_KEY = 'frames.draft.v1'
const ARCHIVE_KEY = 'frames.archive.v1'

export function loadDraft(): DraftPayload | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DraftPayload
  } catch {
    return null
  }
}

export function saveDraft(draft: DraftPayload): void {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // localStorage unavailable (e.g. private browsing) — session-only fallback
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // no-op
  }
}

export function loadArchive(): ArchivedPrompt[] {
  try {
    const raw = window.localStorage.getItem(ARCHIVE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ArchivedPrompt[]) : []
  } catch {
    return []
  }
}

export function saveArchive(archive: ArchivedPrompt[]): void {
  try {
    window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive))
  } catch {
    // no-op
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/jamesrice/dev-projects/frames
npx tsc -b --noEmit
npx eslint src/lib/storage.ts
```

Expected: no errors. (Behavioral verification — including the corrupt-JSON fallback and the private-mode no-op — happens in the browser once `App.tsx` wires this up in Task 5, and again explicitly in Task 14's QA pass.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "Add storage.ts: try/catch-wrapped localStorage draft + archive persistence"
```

---

### Task 5: App shell — state, hydration, layout, Header, Hero

**Files:**
- Create: `src/components/Header.tsx`, `src/components/Hero.tsx`
- Modify: `src/App.tsx` (replace placeholder with full reducer + layout)

**Interfaces:**
- Consumes: `WORLD` from `../data/world`; `assemblePrompt` from `../lib/assemble`; `loadDraft`, `saveDraft`, `clearDraft`, `loadArchive`, `saveArchive`, and types `Approach`, `DraftPayload`, `ArchivedPrompt` from `../lib/storage`.
- Produces: `App.tsx` internal `BuilderState` (`DraftPayload & { archive: ArchivedPrompt[] }`) and `Action` union, used by every later task that dispatches into the reducer. Exposes the two-column layout (`<main>` with a left content column and a right rail slot) that Tasks 6–12 render into.

- [ ] **Step 1: Write `src/components/Header.tsx`**

```tsx
const NAV_LINKS = ['Worlds', 'Archive', 'Manual', 'Pricing']

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6">
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={25}
          viewBox="0 0 64 67"
          fill="none"
          className="text-ft-ink"
          aria-hidden="true"
        >
          <path d="M31.939 42.5853L21.286 36.5151L31.939 30.4136L42.5892 36.5094L31.939 42.5882" fill="currentColor" />
          <path
            d="M42.5892 12.1831L31.9419 6.0873L21.286 0L10.6359 6.10432L21.286 12.1916L31.9419 18.2874L42.5892 24.3832L53.2365 18.2818L42.5892 12.1831Z"
            fill="currentColor"
          />
          <path d="M53.2365 30.4168L63.8837 24.3862L53.2365 18.2876V30.4168Z" fill="currentColor" />
          <path d="M10.6358 18.2251L0 24.3294L7.08866 28.3905L10.6358 30.4196V18.2251Z" fill="currentColor" />
          <path
            d="M31.9419 18.2876L21.286 12.1918L10.6358 6.10449V18.2252V30.4196L7.08866 28.3905L0 24.3295V36.5807L10.6358 42.6765V48.7808V54.6752V54.8057V60.91L21.286 67.0002V60.8987V54.8738V48.7723L31.9419 54.8256V54.695V48.778V42.5857L21.286 36.5154V24.3181L31.9419 30.4111L42.5891 36.5098V24.3834L31.9419 18.2876Z"
            fill="currentColor"
          />
          <path d="M42.5891 54.8396V48.6416L31.9418 54.8254V60.8758L42.5891 66.9659V60.8985V54.8396Z" fill="currentColor" />
        </svg>
        <span className="font-mono text-sm uppercase tracking-[0.08em]">Frames</span>
      </div>
      <nav className="hidden items-center gap-8 font-mono text-sm uppercase tracking-[0.08em] text-ft-ink/60 md:flex">
        {NAV_LINKS.map((link) => (
          <span key={link} aria-disabled="true" className="cursor-default select-none">
            {link}
          </span>
        ))}
      </nav>
      <button
        type="button"
        aria-disabled="true"
        className="cursor-default rounded-full border-[1.5px] border-ft-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.08em]"
      >
        Sign In
      </button>
    </header>
  )
}
```

- [ ] **Step 2: Write `src/components/Hero.tsx`**

```tsx
interface HeroProps {
  eyebrow: string
  name: string
  subline: string
}

export function Hero({ eyebrow, name, subline }: HeroProps) {
  return (
    <section className="pb-12 pt-4">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ft-purple">{eyebrow}</p>
      <h1 className="mt-4 max-w-[16ch] font-gilroy text-[clamp(40px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.02em]">
        {name}
      </h1>
      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ft-ink/70">{subline}</p>
    </section>
  )
}
```

- [ ] **Step 3: Write full `src/App.tsx`**

```tsx
import { useEffect, useMemo, useReducer, useState } from 'react'
import { WORLD } from './data/world'
import { assemblePrompt } from './lib/assemble'
import {
  loadArchive,
  loadDraft,
  saveArchive,
  saveDraft,
  clearDraft,
} from './lib/storage'
import type { Approach, ArchivedPrompt, DraftPayload } from './lib/storage'
import type { Preset } from './data/world'
import { Header } from './components/Header'
import { Hero } from './components/Hero'

const CHAR_CAP = 1024

interface BuilderState extends DraftPayload {
  archive: ArchivedPrompt[]
}

type Action =
  | { type: 'HYDRATE'; draft: DraftPayload | null; archive: ArchivedPrompt[] }
  | { type: 'SET_APPROACH'; approach: Approach }
  | { type: 'APPLY_PRESET'; preset: Preset }
  | { type: 'SET_TEXT'; fieldId: string; value: string }
  | { type: 'TOGGLE_OPTION'; fieldId: string; optionId: string }
  | { type: 'TOGGLE_CAP_MODE' }
  | { type: 'ARCHIVE_PROMPT'; prompt: string }
  | { type: 'DELETE_ARCHIVED'; id: string }
  | { type: 'RESET' }

function initialText(): Record<string, string> {
  const text: Record<string, string> = {}
  for (const section of WORLD.sections) {
    if (section.kind !== 'text') continue
    for (const field of section.fields) {
      if (field.kind === 'text') text[field.id] = ''
    }
  }
  return text
}

function initialSelections(): Record<string, string | null> {
  const selections: Record<string, string | null> = {}
  for (const section of WORLD.sections) {
    if (section.kind !== 'options') continue
    for (const field of section.fields) {
      if (field.kind === 'options') selections[field.id] = null
    }
  }
  return selections
}

function createInitialState(): BuilderState {
  return {
    approach: null,
    presetId: null,
    text: initialText(),
    selections: initialSelections(),
    capMode: false,
    archive: [],
  }
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'HYDRATE': {
      if (!action.draft) return { ...state, archive: action.archive }
      return { ...state, ...action.draft, archive: action.archive }
    }
    case 'SET_APPROACH':
      return {
        ...state,
        approach: action.approach,
        presetId: action.approach === 'manual' ? null : state.presetId,
      }
    case 'APPLY_PRESET':
      return {
        ...state,
        approach: 'prelit',
        presetId: action.preset.id,
        selections: { ...state.selections, ...action.preset.selections },
      }
    case 'SET_TEXT':
      return { ...state, text: { ...state.text, [action.fieldId]: action.value } }
    case 'TOGGLE_OPTION': {
      const current = state.selections[action.fieldId]
      const next = current === action.optionId ? null : action.optionId
      return {
        ...state,
        presetId: null,
        selections: { ...state.selections, [action.fieldId]: next },
      }
    }
    case 'TOGGLE_CAP_MODE':
      return { ...state, capMode: !state.capMode }
    case 'ARCHIVE_PROMPT': {
      const preset = WORLD.presets.find((candidate) => candidate.id === state.presetId)
      const entry: ArchivedPrompt = {
        id: crypto.randomUUID(),
        name: preset ? preset.name : 'Manual Prompt',
        prompt: action.prompt,
        savedAt: Date.now(),
      }
      return { ...state, archive: [entry, ...state.archive] }
    }
    case 'DELETE_ARCHIVED':
      return { ...state, archive: state.archive.filter((entry) => entry.id !== action.id) }
    case 'RESET':
      return { ...createInitialState(), archive: state.archive }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    dispatch({ type: 'HYDRATE', draft: loadDraft(), archive: loadArchive() })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const timeout = setTimeout(() => {
      const draft: DraftPayload = {
        approach: state.approach,
        presetId: state.presetId,
        text: state.text,
        selections: state.selections,
        capMode: state.capMode,
      }
      saveDraft(draft)
    }, 300)
    return () => clearTimeout(timeout)
  }, [state.approach, state.presetId, state.text, state.selections, state.capMode, hydrated])

  useEffect(() => {
    if (!hydrated) return
    saveArchive(state.archive)
  }, [state.archive, hydrated])

  const prompt = useMemo(
    () => assemblePrompt(state),
    [state.text, state.selections],
  )

  return (
    <div className="min-h-screen bg-ft-beige text-ft-ink">
      <Header />
      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 pb-24 pt-8 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <Hero eyebrow={WORLD.eyebrow} name={WORLD.name} subline={WORLD.subline} />
        </div>
        <aside className="h-fit rounded-[20px] bg-ft-ink p-6 text-white lg:sticky lg:top-8">
          <p className="text-white/50">{prompt || 'Nothing conjured yet.'}</p>
        </aside>
      </main>
    </div>
  )
}
```

Note: `CHAR_CAP` is defined but unused until Task 11 wires `PromptRail`; that will trip `noUnusedLocals`. For this task only, prefix it as `const _CHAR_CAP = 1024` **or** simply omit the constant here and add it in Task 11 instead. Use the latter: delete the `CHAR_CAP` line from this step's `App.tsx` and add it back in Task 11's edit.

- [ ] **Step 4: Verify build and lint**

```bash
cd /Users/jamesrice/dev-projects/frames
npm run build
npm run lint
```

Expected: both exit 0.

- [ ] **Step 5: Verify in browser**

Start the dev server and confirm: Header renders with FT mark, inert nav links, and "Sign In"; Hero renders eyebrow/headline/subline; a dark aside on the right shows "Nothing conjured yet."; no console errors. Open DevTools → Application → Local Storage and confirm `frames.draft.v1` and `frames.archive.v1` appear after a 300ms delay.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Header.tsx src/components/Hero.tsx
git commit -m "Add App reducer, hydration, debounced persistence, Header, Hero"
```

---

### Task 6: ApproachPicker

**Files:**
- Create: `src/components/ApproachPicker.tsx`
- Modify: `src/App.tsx` (render `<ApproachPicker>` under `<Hero>`, dispatch `SET_APPROACH`)

**Interfaces:**
- Consumes: `Approach` type from `../lib/storage`.
- Produces: `<ApproachPicker approach={Approach | null} onSelect={(approach: Approach) => void} />`.

- [ ] **Step 1: Write `src/components/ApproachPicker.tsx`**

```tsx
import type { Approach } from '../lib/storage'

interface ApproachPickerProps {
  approach: Approach | null
  onSelect: (approach: Approach) => void
}

const CARDS: { id: Approach; title: string; description: string }[] = [
  { id: 'prelit', title: 'Pre-Lit', description: 'Start from a curated look and adjust what you like.' },
  { id: 'manual', title: 'Manual Setup', description: 'Build the frame field by field, from nothing.' },
]

export function ApproachPicker({ approach, onSelect }: ApproachPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CARDS.map((card) => {
        const active = approach === card.id
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            aria-pressed={active}
            className={`rounded-[20px] border p-6 text-left transition-all duration-[250ms] ease-ft ${
              active
                ? 'border-ft-purple bg-ft-purple/5 shadow-[0_10px_25px_rgba(76,0,255,0.12)]'
                : 'border-ft-ink/15 hover:border-ft-purple/60'
            }`}
          >
            <h3 className="font-gilroy text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-ft-ink/60">{card.description}</p>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import:

```tsx
import { ApproachPicker } from './components/ApproachPicker'
```

Replace the left column's contents:

```tsx
<div className="min-w-0">
  <Hero eyebrow={WORLD.eyebrow} name={WORLD.name} subline={WORLD.subline} />
  <ApproachPicker
    approach={state.approach}
    onSelect={(approach) => dispatch({ type: 'SET_APPROACH', approach })}
  />
</div>
```

- [ ] **Step 3: Verify build and lint**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Verify in browser**

Click each approach card; confirm the clicked card gets the purple border/tint and the other returns to neutral. Refresh the page — confirm the previously selected approach persists (hydrated from `localStorage`).

- [ ] **Step 5: Commit**

```bash
git add src/components/ApproachPicker.tsx src/App.tsx
git commit -m "Add ApproachPicker (Pre-Lit vs Manual)"
```

---

### Task 7: Accordion shell + section dispatcher

**Files:**
- Create: `src/components/Accordion.tsx`
- Modify: `src/App.tsx` (render one `<Accordion>` per `WORLD.sections` entry, empty bodies for now)

**Interfaces:**
- Produces: `<Accordion number={string} title={string} subtitle={string}>{children}</Accordion>` — owns its own open/closed boolean state, so multiple sections can be open simultaneously (per spec).

- [ ] **Step 1: Write `src/components/Accordion.tsx`**

```tsx
import { useState, type ReactNode } from 'react'

interface AccordionProps {
  number: string
  title: string
  subtitle: string
  children: ReactNode
}

export function Accordion({ number, title, subtitle, children }: AccordionProps) {
  const [open, setOpen] = useState(false)
  const panelId = `accordion-panel-${number}`

  return (
    <div className="border-b border-ft-ink/10 py-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-6 text-left"
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-ft-purple">{number}</span>
          <span>
            <span className="block font-gilroy text-2xl font-semibold">{title}</span>
            <span className="mt-1 block text-sm text-ft-ink/55">{subtitle}</span>
          </span>
        </span>
        <span
          className={`mt-2 shrink-0 text-2xl font-light transition-transform duration-[250ms] ease-ft ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-[250ms] ease-ft ${
          open ? 'mt-6 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import:

```tsx
import { Accordion } from './components/Accordion'
```

Append after `<ApproachPicker>`:

```tsx
<div className="mt-10 border-t border-ft-ink/10">
  {WORLD.sections.map((section) => (
    <Accordion key={section.id} number={section.number} title={section.title} subtitle={section.subtitle}>
      <p className="text-sm text-ft-ink/40">Section content coming in the next task.</p>
    </Accordion>
  ))}
</div>
```

- [ ] **Step 3: Verify build and lint**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Verify in browser**

Confirm all 8 numbered sections render (01–08) with correct titles/subtitles from `world.ts`. Click several headers — confirm each opens/closes independently (open two at once, confirm both stay open) and the `+` rotates to an `×` shape on open.

- [ ] **Step 5: Commit**

```bash
git add src/components/Accordion.tsx src/App.tsx
git commit -m "Add generic Accordion shell, render all 8 sections from world.ts"
```

---

### Task 8: PresetGrid (Section 01)

**Files:**
- Create: `src/components/PresetGrid.tsx`
- Modify: `src/App.tsx` (render `<PresetGrid>` inside the `kind === 'presets'` section)

**Interfaces:**
- Consumes: `Preset` type from `../data/world`.
- Produces: `<PresetGrid presets={Preset[]} selectedPresetId={string | null} onSelect={(preset: Preset) => void} />`.

- [ ] **Step 1: Write `src/components/PresetGrid.tsx`**

```tsx
import type { Preset } from '../data/world'

interface PresetGridProps {
  presets: Preset[]
  selectedPresetId: string | null
  onSelect: (preset: Preset) => void
}

const TILE_COLORS: Record<Preset['tileColor'], string> = {
  aqua: 'bg-ft-aqua',
  blue: 'bg-ft-blue',
  red: 'bg-ft-red',
  orange: 'bg-ft-orange',
}

export function PresetGrid({ presets, selectedPresetId, onSelect }: PresetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset) => {
        const active = preset.id === selectedPresetId
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            aria-pressed={active}
            className={`overflow-hidden rounded-[20px] border text-left transition-all duration-[250ms] ease-ft ${
              active
                ? 'border-ft-purple shadow-[0_10px_25px_rgba(76,0,255,0.12)]'
                : 'border-ft-ink/15 hover:border-ft-purple/60'
            }`}
          >
            <div className={`h-24 w-full ${TILE_COLORS[preset.tileColor]}`} aria-hidden="true" />
            <div className="p-5">
              <h4 className="font-gilroy text-lg font-semibold">{preset.name}</h4>
              <p className="mt-1 font-mono text-xs text-ft-ink/55">{preset.specString}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import:

```tsx
import { PresetGrid } from './components/PresetGrid'
```

Replace the section-body placeholder with kind-based dispatch:

```tsx
<Accordion key={section.id} number={section.number} title={section.title} subtitle={section.subtitle}>
  {section.kind === 'presets' && (
    <PresetGrid
      presets={WORLD.presets}
      selectedPresetId={state.presetId}
      onSelect={(preset) => dispatch({ type: 'APPLY_PRESET', preset })}
    />
  )}
</Accordion>
```

- [ ] **Step 3: Verify build and lint**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Verify in browser**

Open section 01. Confirm 6 preset cards render with distinct colored tiles, names, and spec strings. Click "Neon Noir Street" — confirm it gets the purple border, and the dark rail on the right now shows an assembled prompt (not "Nothing conjured yet.") since `selections` changed. Click a different preset — confirm the previous one's border clears.

- [ ] **Step 5: Commit**

```bash
git add src/components/PresetGrid.tsx src/App.tsx
git commit -m "Add PresetGrid, wire bulk-apply into section 01"
```

---

### Task 9: TextField (Section 02 — The Scene)

**Files:**
- Create: `src/components/TextField.tsx`
- Modify: `src/App.tsx` (render `<TextField>` per field inside the `kind === 'text'` section)

**Interfaces:**
- Consumes: `TextField` type from `../data/world` (aliased on import to avoid a name clash with the component).
- Produces: `<TextField field={TextFieldModel} value={string} onChange={(value: string) => void} />`.

- [ ] **Step 1: Write `src/components/TextField.tsx`**

```tsx
import type { TextField as TextFieldModel } from '../data/world'

interface TextFieldProps {
  field: TextFieldModel
  value: string
  onChange: (value: string) => void
}

export function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <label className="block py-4 first:pt-0">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-ft-ink/60">{field.label}</span>
      <span className="mt-1 block text-sm text-ft-ink/45">{field.hint}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={2}
        className="mt-3 w-full resize-y rounded-[12px] border border-ft-ink/15 bg-white/40 p-4 text-base leading-relaxed outline-none transition-colors duration-[250ms] ease-ft placeholder:text-ft-ink/30 focus:border-ft-purple focus-visible:ring-2 focus-visible:ring-ft-purple/40"
      />
    </label>
  )
}
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import (aliased):

```tsx
import { TextField } from './components/TextField'
```

Add to the section dispatch inside `<Accordion>`:

```tsx
{section.kind === 'text' &&
  section.fields.map((field) =>
    field.kind === 'text' ? (
      <TextField
        key={field.id}
        field={field}
        value={state.text[field.id] ?? ''}
        onChange={(value) => dispatch({ type: 'SET_TEXT', fieldId: field.id, value })}
      />
    ) : null,
  )}
```

- [ ] **Step 3: Verify build and lint**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Verify in browser**

Open section 02. Confirm 4 labeled textareas render (Subject, Environment, Action, Light & Atmosphere) with hint text and placeholders. Type into "Subject" — confirm the dark rail's prompt updates live and the typed text appears first (sentence-cased). Clear the field — confirm it drops out of the prompt without leaving a stray comma.

- [ ] **Step 5: Commit**

```bash
git add src/components/TextField.tsx src/App.tsx
git commit -m "Add TextField, wire The Scene section's four textareas"
```

---

### Task 10: OptionCardGrid (Sections 03–08)

**Files:**
- Create: `src/components/OptionCardGrid.tsx`
- Modify: `src/App.tsx` (render `<OptionCardGrid>` per field inside every `kind === 'options'` section)

**Interfaces:**
- Consumes: `OptionsField` type from `../data/world`.
- Produces: `<OptionCardGrid field={OptionsField} selectedOptionId={string | null} onSelect={(optionId: string) => void} />`. Fully data-driven — this one component renders sections 03 (Human Moment), 04 (Style), 05 (Light), 06 (Composition), 07 (Camera — 4 fields), and 08 (Time Machine — 5 fields) with no per-section code, since `World.sections` already carries every field/option.

- [ ] **Step 1: Write `src/components/OptionCardGrid.tsx`**

```tsx
import type { OptionsField } from '../data/world'

interface OptionCardGridProps {
  field: OptionsField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function OptionCardGrid({ field, selectedOptionId, onSelect }: OptionCardGridProps) {
  return (
    <div className="py-4 first:pt-0">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ft-ink/60">{field.label}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={`rounded-[12px] border p-4 text-left transition-all duration-[250ms] ease-ft ${
                active ? 'border-ft-purple bg-ft-purple/5' : 'border-ft-ink/15 hover:border-ft-purple/50'
              }`}
            >
              <span className="block font-gilroy text-base font-semibold">{option.name}</span>
              <span className="mt-1 block text-sm text-ft-ink/55">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import:

```tsx
import { OptionCardGrid } from './components/OptionCardGrid'
```

Add to the section dispatch inside `<Accordion>`:

```tsx
{section.kind === 'options' &&
  section.fields.map((field) =>
    field.kind === 'options' ? (
      <OptionCardGrid
        key={field.id}
        field={field}
        selectedOptionId={state.selections[field.id] ?? null}
        onSelect={(optionId) => dispatch({ type: 'TOGGLE_OPTION', fieldId: field.id, optionId })}
      />
    ) : null,
  )}
```

- [ ] **Step 3: Verify build and lint**

```bash
npm run build
npm run lint
```

- [ ] **Step 4: Verify in browser**

Open sections 03–08 one at a time. Confirm: 03/04/05/06 each render one labeled card grid (6 options each); 07 (Camera) renders 4 labeled sub-groups (Camera Body, Depth of Field, Film Stock, Grain); 08 (Time Machine) renders 5 labeled sub-groups (Period, Wardrobe, Signage, Vehicles, Street Life). Click an option — confirm it highlights, the previously-applied preset's border in section 01 clears (since `presetId` resets to `null` on manual edit), and clicking the same option again deselects it. Confirm the rail prompt updates in section/field order.

- [ ] **Step 5: Commit**

```bash
git add src/components/OptionCardGrid.tsx src/App.tsx
git commit -m "Add OptionCardGrid, wire sections 03-08 (data-driven, all option fields)"
```

---

### Task 11: PromptRail — live prompt, counter, cap mode, copy

**Files:**
- Create: `src/components/PromptRail.tsx`
- Modify: `src/App.tsx` (replace the inline `<aside>` stub with `<PromptRail>`, add clipboard handler, add back `CHAR_CAP`)

**Interfaces:**
- Consumes: `ArchivedPrompt` type from `../lib/storage`.
- Produces: `<PromptRail>` — this task wires only the Draft tab (prompt display, counter, cap toggle, Copy button); the Archive tab and `ArchiveList` land in Task 12, but the prop surface for both is defined now so Task 12 only has to fill in the `archive`/`tab` behavior, not touch this component's signature again.

- [ ] **Step 1: Write `src/components/PromptRail.tsx`**

```tsx
import type { ArchivedPrompt } from '../lib/storage'
import { ArchiveList } from './ArchiveList'

interface PromptRailProps {
  prompt: string
  charCap: number
  capMode: boolean
  onToggleCapMode: () => void
  onCopy: () => void
  onArchive: () => void
  onReset: () => void
  copied: boolean
  tab: 'draft' | 'archive'
  onTabChange: (tab: 'draft' | 'archive') => void
  archive: ArchivedPrompt[]
  onCopyArchived: (entry: ArchivedPrompt) => void
  onDeleteArchived: (id: string) => void
}

export function PromptRail({
  prompt,
  charCap,
  capMode,
  onToggleCapMode,
  onCopy,
  onArchive,
  onReset,
  copied,
  tab,
  onTabChange,
  archive,
  onCopyArchived,
  onDeleteArchived,
}: PromptRailProps) {
  const empty = prompt.length === 0
  const overLimit = capMode && prompt.length > charCap

  return (
    <aside className="h-fit rounded-[20px] bg-ft-ink text-white lg:sticky lg:top-8">
      <div className="flex border-b border-white/10">
        {(['draft', 'archive'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTabChange(value)}
            aria-pressed={tab === value}
            className={`flex-1 py-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft ${
              tab === value ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {value === 'draft' ? 'Draft' : `Archive (${archive.length})`}
          </button>
        ))}
      </div>

      {tab === 'draft' ? (
        <div className="p-6">
          <div className="min-h-[160px] text-lg leading-relaxed">
            {empty ? (
              <p className="text-white/50">
                <span className="bg-gradient-to-r from-[#F24A3D] to-[#F9B8C2] bg-clip-text text-transparent">
                  Nothing conjured
                </span>{' '}
                yet. Pick a preset or start building below — the prompt takes shape right here.
              </p>
            ) : (
              <p>{prompt}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between font-mono text-xs text-white/50">
            <button
              type="button"
              onClick={onToggleCapMode}
              aria-pressed={capMode}
              className="uppercase tracking-[0.08em] hover:text-white"
            >
              {capMode ? 'Cap: On' : 'Cap: Off'}
            </button>
            <span className={overLimit ? 'text-[#F24A3D]' : ''}>
              {capMode
                ? `${prompt.length} / ${charCap}${overLimit ? ` (over by ${prompt.length - charCap})` : ''}`
                : prompt.length}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={empty}
              onClick={onCopy}
              className="rounded-full border-[1.5px] border-white px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft hover:bg-ft-purple hover:border-ft-purple disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white disabled:hover:bg-transparent"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              disabled={empty}
              onClick={onArchive}
              className="rounded-full border-[1.5px] border-white px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft hover:bg-ft-purple hover:border-ft-purple disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white disabled:hover:bg-transparent"
            >
              Archive
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border-[1.5px] border-white/30 px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-colors duration-[250ms] ease-ft hover:border-white hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <ArchiveList archive={archive} onCopy={onCopyArchived} onDelete={onDeleteArchived} />
      )}
    </aside>
  )
}
```

Note: this imports `ArchiveList` from `./ArchiveList`, which does not exist yet — that file is created in Task 12. Building will fail until Task 12 lands; that is expected and acceptable within this task since Tasks 11 and 12 are the two halves of one component and must be verified together. Do not run `npm run build` at the end of this task — run it at the end of Task 12 instead.

- [ ] **Step 2: Modify `src/App.tsx`**

Add imports:

```tsx
import { PromptRail } from './components/PromptRail'
```

Add local UI state (tab + copy feedback) and the `CHAR_CAP` constant, and a clipboard handler, inside the `App` function:

```tsx
const CHAR_CAP = 1024
```

(module scope, alongside the existing top-level constants)

```tsx
const [tab, setTab] = useState<'draft' | 'archive'>('draft')
const [copied, setCopied] = useState(false)

const handleReset = () => {
  dispatch({ type: 'RESET' })
  clearDraft()
}

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  } catch {
    // clipboard unavailable — leave the button state unchanged
  }
}
```

Replace the placeholder `<aside>` with:

```tsx
<PromptRail
  prompt={prompt}
  charCap={CHAR_CAP}
  capMode={state.capMode}
  onToggleCapMode={() => dispatch({ type: 'TOGGLE_CAP_MODE' })}
  onCopy={() => handleCopy(prompt)}
  onArchive={() => dispatch({ type: 'ARCHIVE_PROMPT', prompt })}
  onReset={handleReset}
  copied={copied}
  tab={tab}
  onTabChange={setTab}
  archive={state.archive}
  onCopyArchived={(entry) => handleCopy(entry.prompt)}
  onDeleteArchived={(id) => dispatch({ type: 'DELETE_ARCHIVED', id })}
/>
```

- [ ] **Step 3: Commit (deferred verification)**

```bash
git add src/components/PromptRail.tsx src/App.tsx
git commit -m "Add PromptRail: live prompt, counter, cap mode, copy (Archive tab in next commit)"
```

---

### Task 12: ArchiveList + Draft/Archive tabs + Reset

**Files:**
- Create: `src/components/ArchiveList.tsx`

**Interfaces:**
- Consumes: `ArchivedPrompt` type from `../lib/storage`.
- Produces: `<ArchiveList archive={ArchivedPrompt[]} onCopy={(entry: ArchivedPrompt) => void} onDelete={(id: string) => void} />`, imported by `PromptRail.tsx` (Task 11).

- [ ] **Step 1: Write `src/components/ArchiveList.tsx`**

```tsx
import type { ArchivedPrompt } from '../lib/storage'

interface ArchiveListProps {
  archive: ArchivedPrompt[]
  onCopy: (entry: ArchivedPrompt) => void
  onDelete: (id: string) => void
}

export function ArchiveList({ archive, onCopy, onDelete }: ArchiveListProps) {
  if (archive.length === 0) {
    return <p className="p-6 text-sm text-white/50">Nothing archived yet — save a prompt from the Draft tab.</p>
  }

  return (
    <ul className="max-h-[520px] divide-y divide-white/10 overflow-y-auto">
      {archive.map((entry) => (
        <li key={entry.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-gilroy text-sm font-semibold">{entry.name}</p>
              <p className="mt-1 text-xs text-white/40">{new Date(entry.savedAt).toLocaleString()}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onCopy(entry)}
                className="font-mono text-xs uppercase tracking-[0.08em] text-white/60 hover:text-white"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="font-mono text-xs uppercase tracking-[0.08em] text-white/60 hover:text-[#F24A3D]"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-white/70">{entry.prompt}</p>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 2: Verify build and lint**

```bash
cd /Users/jamesrice/dev-projects/frames
npm run build
npm run lint
```

Expected: both exit 0 (this closes out the deferred verification from Task 11 too).

- [ ] **Step 3: Verify in browser**

Build a prompt (pick a preset or fill in scene text + a few options). In the Draft tab: confirm the counter updates live; toggle "Cap: On" — confirm it shows `n / 1024`; if you can push the prompt over 1024 characters (fill every text field with long text) confirm the counter turns red and shows "(over by N)" with no truncation of the displayed prompt. Click Copy — confirm the button reads "Copied" briefly, then paste elsewhere to confirm the clipboard actually has the prompt text. Click Archive — confirm the Archive tab's count increments. Switch to the Archive tab — confirm the entry appears with a name, timestamp, and prompt preview; click Copy on it and Delete on it, confirming deletion removes it and persists across a refresh. Click Reset — confirm all fields/selections clear, the prompt rail returns to the empty state, Copy/Archive become disabled, and the archive is untouched.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArchiveList.tsx
git commit -m "Add ArchiveList; PromptRail Draft/Archive tabs now fully wired"
```

---

### Task 13: Polish pass — motion, focus states, responsive, reduced-motion, empty/disabled states

**Files:**
- Modify: `src/components/Accordion.tsx`, `src/components/ApproachPicker.tsx`, `src/components/PresetGrid.tsx`, `src/components/OptionCardGrid.tsx`, `src/components/PromptRail.tsx`, `src/App.tsx`

This task is a review-and-fix pass, not new features — every transition, focus ring, and breakpoint listed below should already mostly exist from earlier tasks; this task closes the gaps.

**Interfaces:** none new — this task only edits existing JSX/className strings in place.

- [ ] **Step 1: Focus-visible audit**

Every interactive element (buttons in `ApproachPicker`, `PresetGrid`, `OptionCardGrid`, `Accordion` header, `PromptRail` tabs/actions, `ArchiveList` copy/delete) must show a visible focus ring for keyboard users. Add `focus-visible:ring-2 focus-visible:ring-ft-purple/50 focus-visible:outline-none` to each interactive `className` that doesn't already have a focus treatment (the `TextField` textarea already has one from Task 9). Verify by tabbing through the whole page with the keyboard only (no mouse) and confirming every focusable element is visibly highlighted.

- [ ] **Step 2: Responsive check at 680px and below**

Resize the browser to 375px width (mobile). Confirm: `ApproachPicker` cards stack to one column (already `grid-cols-1 sm:grid-cols-2` — verify `sm` breakpoint, 640px, is close enough to spec's 680px that nothing looks broken between 640–680px; if it does, change `sm:` to an arbitrary `min-[680px]:` variant on the three grids that use `sm:grid-cols-2` in `ApproachPicker.tsx`, `PresetGrid.tsx`, and `OptionCardGrid.tsx`). Confirm the `App.tsx` main layout's `lg:grid-cols-[1fr_420px]` collapses to a single column below `lg` (1024px) and the rail is no longer `sticky` (already conditional via the `lg:` prefix). Confirm text remains readable, no horizontal scrollbar appears, and preset tiles/option cards stay tappable-sized (not cramped).

- [ ] **Step 3: Reduced-motion check**

Using the browser preview tool's `colorScheme`/media-emulation (or OS-level "reduce motion" if testing manually), confirm the accordion open/close, card hover transitions, and Copy button state change all become effectively instant — this should already work since Task 1's `index.css` sets `transition-duration: 0.01ms !important` under `@media (prefers-reduced-motion: reduce)` globally. Verify no component sets an inline `style` transition that would bypass this rule (none should, per the code written in Tasks 6–12, which all use Tailwind `transition-*` utility classes).

- [ ] **Step 4: Hairline dividers between accordion rows**

Confirm `Accordion.tsx`'s `border-b border-ft-ink/10` combined with `App.tsx`'s wrapping `border-t border-ft-ink/10` produces exactly one hairline between every section and one at the very top, with no doubled or missing lines at the first/last section.

- [ ] **Step 5: Verify build and lint**

```bash
cd /Users/jamesrice/dev-projects/frames
npm run build
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components src/App.tsx
git commit -m "Polish pass: focus-visible states, responsive breakpoint check, reduced-motion verification"
```

---

### Task 14: Production build verification + full manual QA pass

**Files:** none (verification only).

- [ ] **Step 1: Full production build**

```bash
cd /Users/jamesrice/dev-projects/frames
rm -rf dist
npm run build
npm run lint
```

Expected: `tsc -b` reports zero errors, `vite build` completes, `dist/` is populated, `eslint .` exits 0.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Open the preview URL in the browser tool and re-run this checklist against the production build (not just `npm run dev`), since Tailwind's production CSS purge can occasionally drop a class that only appeared in a dynamic template string:

- All 8 accordion sections render their correct titles/content.
- Preset bulk-apply sets every mapped field, and per-field override after a preset works (change one option, confirm only that field changes and the preset card deselects).
- Prompt assembly order: scene text (non-empty only) first, then options in section 03→08, field order within section 07/08; sentence-casing on the first fragment; trailing period; empty state returns to the styled empty-state line.
- Counter and cap mode: off by default shows plain count; on shows `n / 1024`; overflow shows red + "(over by N)"; prompt is never silently truncated.
- Persistence: fill in a partial prompt, refresh the page, confirm it restores; open DevTools and manually corrupt `localStorage['frames.draft.v1']` (set it to `"{not json"`), refresh, confirm the app falls back to a clean empty state without throwing.
- Archive: add 2+ entries, copy one, delete one, refresh, confirm the remaining entries persist.
- Responsive: 375px, 768px, 1440px — no horizontal scroll, single column below ~680px.
- Reduced motion: emulate `prefers-reduced-motion: reduce` and confirm transitions are near-instant.
- No inert nav link in the Header navigates anywhere or throws a console error when clicked.

- [ ] **Step 3: Screenshot proof**

Take a full-page screenshot of the desktop layout (with a preset applied and a couple of sections open) and one mobile-width screenshot, to confirm visually before publishing.

- [ ] **Step 4: Fix any issues found, then re-run Step 1–2**

If the QA pass surfaces a bug, fix it in the relevant component file, re-run the build, and re-verify — do not proceed to publishing with a known issue.

- [ ] **Step 5: Commit (only if fixes were made)**

```bash
git add -A
git commit -m "Fix issues found in production QA pass"
```

If no fixes were needed, skip this step — there is nothing to commit.

---

### Task 15: Publish to GitHub

**Files:** none (repo operation).

- [ ] **Step 1: Confirm working tree is clean**

```bash
cd /Users/jamesrice/dev-projects/frames
git status
```

Expected: nothing to commit (Task 14 already committed any fixes).

- [ ] **Step 2: Create the GitHub repo and push**

```bash
cd /Users/jamesrice/dev-projects/frames
gh repo create jamesrice/frames --public --source=. --remote=origin --push
```

This creates `jamesrice/frames` (personal account — matches the existing convention used by `magical-mystery-tour` and `drops-adventure`, not the `fictiontribe` org), adds it as the `origin` remote, and pushes `main`.

- [ ] **Step 3: Verify**

```bash
gh repo view jamesrice/frames --web
```

Confirm the repo opens in the browser tool and shows the full commit history from Tasks 1–14.

---

### Task 16: Publish to Cloudflare Pages

**Files:** none (deploy operation). `package.json`'s `deploy` script (`vite build && wrangler pages deploy dist --project-name frames`) was already added in Task 1.

- [ ] **Step 1: Create the Pages project explicitly (non-interactive)**

```bash
cd /Users/jamesrice/dev-projects/frames
wrangler pages project create frames --production-branch main
```

Expected: confirms creation of a new Pages project named `frames`.

- [ ] **Step 2: Deploy**

```bash
npm run deploy
```

Expected: builds to `dist/` and uploads it, printing a `https://frames.pages.dev` (or a deployment-specific `*.frames.pages.dev`) URL on success.

- [ ] **Step 3: Verify the live site**

Open the printed URL in the browser tool. Re-run the core QA checks from Task 14 (preset apply, prompt assembly, persistence, responsive) against the live deployment to confirm nothing broke in the production build/deploy step (e.g. font paths, since `public/fonts/*` must resolve correctly from the Pages CDN root).

- [ ] **Step 4: Report the URLs**

Confirm both URLs to hand back: the GitHub repo (`https://github.com/jamesrice/frames`) and the live Cloudflare Pages URL (`https://frames.pages.dev`).

---

## Self-Review Notes

- **Spec coverage:** Every spec section maps to a task — scaffold (Task 1), data schema (Task 2), assembly (Task 3), storage (Task 4), architecture/state (Task 5), each named component (Tasks 5–12), error handling (Tasks 4 build-in + Task 14 QA), visual design tokens (Task 1 theme + used throughout), motion/responsive/reduced-motion (Task 13), milestones 1–6 (Tasks 1–13), and manual verification (Task 14). Publishing (not in the original spec but requested directly by the user) is Tasks 15–16.
- **Placeholder scan:** No task step describes behavior without showing the code; the one deliberate exception (Task 11 deferring its build check to Task 12) is called out explicitly with the reason, not left implicit.
- **Type consistency:** `BuilderState = DraftPayload & { archive: ArchivedPrompt[] }` defined once in `App.tsx` (Task 5) and reused as-is through Task 16; `Approach`, `DraftPayload`, `ArchivedPrompt` defined once in `storage.ts` (Task 4) and imported everywhere else; `Preset`, `Section`, `Field`, `TextField`, `OptionsField`, `Option`, `World` defined once in `world.ts` (Task 2) and imported everywhere else — no redefinitions or renamed duplicates anywhere in the plan.
