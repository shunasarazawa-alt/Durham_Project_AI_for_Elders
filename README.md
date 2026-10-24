EXPERIMENT

# Daywise

Everyday task help for older adults at home. Pick a ready-made task, answer a few questions (tap or speak), and get a clear result. AI runs behind the scenes — no prompting skills required.

**Something else** lets people ask in their own words when no ready-made task fits.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Optional real AI

Without a key, the app runs in **demo mode** (useful local templates).

1. Copy `.env.example` to `.env`
2. Set `VITE_OPENAI_API_KEY=sk-...`
3. Restart `npm run dev`

> For a production deploy, proxy the API through your own backend so the key is not in the browser.

## What you get

- Large, plain UI aimed at independent older adults (and shared tablets in community settings)
- Voice input on every text step (Chrome / Edge work best)
- Photo input for letters and bills
- Read aloud, save, share / copy on results
- **Tasks are data** — add new ones without new screens

## Add a new task

Edit [`src/tasks/definitions.ts`](src/tasks/definitions.ts). Append one object matching the schema in [`docs/ADDING_TASKS.md`](docs/ADDING_TASKS.md).

The home screen, step runner, voice fields, and result actions update automatically.

## Scripts

| Command        | Purpose              |
|----------------|----------------------|
| `npm run dev`  | Local development    |
| `npm run build`| Production build     |
| `npm run preview` | Preview the build |

## Project layout

```
src/
  tasks/definitions.ts   # curated tasks (add here)
  types/task.ts          # TaskDefinition schema
  pages/                 # Home, TaskRunner, Result, Saved
  components/            # Voice, choice, photo, layout
  lib/                   # AI, speech, storage, registry
```

## Durham Project

Built for learning-by-doing: ready-made tasks teach *what AI can help with*; free-form “Something else” opens the door to personal uses.
