# Kōwhai Revise

An independent, free NCEA revision site for New Zealand students (Level 2, Level 3 and Scholarship). Original notes written as MDX, with worked examples, an interactive diagram, practice questions, glossary hover definitions and search. All pages, counts, breadcrumbs, sidebar and next/previous links are generated from the content files.

> Independent study resource. Not affiliated with or endorsed by NZQA. Official past papers and assessment specifications are at https://www.nzqa.govt.nz.

## Setup

Requires Node 18.18 or newer (Node 20 recommended).

```bash
npm install          # also creates package-lock.json: commit it (CI uses `npm ci`)
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm test`, `npm run check` (all three), `npm run build`, `npm start`.

**Put it on GitHub:** `git init`, `git add .`, `git commit -m "Initial commit"`, create an empty repo on GitHub, then `git remote add origin <url>` and `git push -u origin main`. The CI workflow in `.github/workflows/ci.yml` runs typecheck, lint, tests and a build on every push.

**VS Code:** open the folder. `.vscode/extensions.json` recommends ESLint, Tailwind CSS IntelliSense and MDX. "Use workspace TypeScript version" is already set.

Fonts (Bricolage Grotesque and Atkinson Hyperlegible) are fetched from Google Fonts by `next/font` at build time, so the first build needs internet access.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. Set to your real domain in production. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the footer. |
| `FEEDBACK_WEBHOOK_URL` | Optional. Feedback messages are POSTed here (Slack, Discord, Formspree and similar). If empty, they are appended to `.data/feedback.jsonl`, which works locally but not on read-only serverless hosts. |

## Content layout

```
content/
  glossary.json
  <subject>/<level>/<standard>/<topic-group>/<page>.mdx
  <subject>/<level>/<standard>/<topic-group>/<page>.practice.json   (optional)
```

`<level>` is `level-2`, `level-3` or `scholarship`. Folder names are the URL slugs. Example: `content/physics/level-3/mechanics/simple-harmonic-motion/basics.mdx` is served at `/subjects/physics/level-3/mechanics/simple-harmonic-motion/basics`, and its practice set at `/subjects/physics/level-3/practice/mechanics/simple-harmonic-motion/basics`.

### Frontmatter (every page needs all of these)

```yaml
---
title: "Simple harmonic motion: the basics"
description: "Short summary used in meta tags and search."
subjectTitle: "Physics"
asNumber: "91524"                    # quote it
standardTitle: "Demonstrate understanding of mechanical systems"
standardOrder: 1                     # order of the standard within the subject and level
topicGroupTitle: "Simple harmonic motion"
groupOrder: 2                        # order of the group within the standard
order: 1                             # order of the page within the group
---
```

The loader (`src/lib/content.ts`) fails the build with a clear message if a field is missing, or if two pages in the same subject, standard or topic group disagree about a title or AS number.

### Add a subject
Create `content/<subject>/<level>/...` with at least one page. `subjectTitle` in the frontmatter becomes the subject's name. The subject, its hub card and its level pages appear automatically.

### Add a standard
Add a new `<standard>` folder under the subject and level, and give its pages the same `asNumber`, `standardTitle` and `standardOrder`.

### Add a topic group
Add a new `<topic-group>` folder under the standard, and give its pages the same `topicGroupTitle` and `groupOrder`.

### Add a page
Add `<page>.mdx` in the group folder with the frontmatter above. Sidebar, counts, breadcrumbs, next and previous links, sitemap, search and the practice URL all update on their own.

### MDX components you can use in a note
- `<Term id="amplitude">amplitude</Term>`: hover/focus/tap definition from `glossary.json`.
- `<Figure src="/diagrams/x.svg" alt="Long description for screen readers" caption="..." />`
- `<ShmDiagram />`: the simple harmonic motion reference circle.
- `<WorkedExample title="...">`: collapsible, with a Show/Hide button. Inside, use `<Parts>` around a numbered list for lettered parts, `#### Step 1: ...` headings, `**Answer:** ...`, and `<Mistake>...</Mistake>`.
- `<Tips>`: the tips and tricks box.
- Maths: `$inline$` and `$$display$$` LaTeX. Avoid a bare `<` or `{` in prose (MDX treats them as code); write "less than" or put them inside maths.

### Practice sets
`<page>.practice.json` is an array of questions:

```json
{ "id": "q1", "type": "mcq", "prompt": "...", "options": ["a","b","c","d"], "answer": 1, "solution": "...", "noteSection": "heading-slug" }
{ "id": "q5", "type": "short", "prompt": "...", "answer": "15.7 rad/s", "solution": "...", "noteSection": "heading-slug" }
```
`noteSection` is the slug of an H2 on the note (lowercase, words joined by hyphens, punctuation removed).

### Add a glossary term
Add an entry to `content/glossary.json`: `"node": { "term": "Node", "definition": "..." }`, then use `<Term id="node">` in any page. A test fails if a page uses an id that does not exist. Terms used on at least one page are also searchable.

## How it works

- `src/lib/content.ts`: reads MDX, validates frontmatter, builds the catalog (`buildCatalog`), counts and neighbours.
- `src/lib/progress.ts`: pure progress logic: toggle, last-write-wins `mergeProgress`, percentages, score history.
- `src/components/ProgressProvider.tsx`: keeps progress in `localStorage` (signed-out). The sidebar percentage updates instantly from this state.
- `src/lib/shm.ts` and `src/components/ShmDiagram.tsx`: the SHM maths and the interactive diagram (mouse, touch and keyboard).
- Search: `src/lib/search.ts` builds a JSON index at build time, served at `/api/search` and searched in the browser with Fuse.js.
- The sidebar lives in `app/subjects/[subject]/[level]/layout.tsx`, so it keeps its open state and scroll position as you move between pages.

## Tests

`npm test` runs Vitest tests for the content loader and catalog, the progress logic and the SHM maths, and checks that every glossary id used in the notes exists.

## Before you publish

- Check each `asNumber`, standard title and its current status on nzqa.govt.nz. The seed values are placeholders for the physics example.
- Write the privacy policy and terms, and have them reviewed.
- Add real reviews only with permission. The Reviews page is intentionally empty.

## Roadmap (not built yet)

Each item below is part of the original brief and is still to do:

1. Accounts: magic link and Google sign-in, saved subjects and progress synced to a database (Supabase free tier is the suggested choice), and the dashboard. `mergeProgress` is ready for the sync step.
2. Search results page (`/search`). The header search dropdown already works.
3. Reviews marquee on the home page, and real info pages (how NCEA works, how Scholarship works).
4. Past exams hub (outbound NZQA links) and mock exams hub with PDFs and marking guides.
5. The three short MP4 clips in `public/videos/` (`notes.mp4`, `diagram.mp4`, `practice.mp4`). The home page picks them up automatically when present.
6. Practice results saved per account (they are saved in this browser for now).
7. A Lighthouse pass and a screen-reader pass once it is running.
