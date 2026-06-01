# Oopsly

> Design beautiful, animated error pages in seconds. Export production-ready code for any framework — no backend, no account, no friction.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/oopsly)

---

## What it does

Most error pages are an afterthought. Oopsly is a client-side visual builder where you pick an emoji, choose an animation, write your copy, and get back a clean, self-contained component you can drop into your codebase.

Everything runs in the browser. There is no server, no auth, no database. Your design lives in the URL.

---

## Features

| | |
|---|---|
| **Live preview** | Changes render instantly in a full-page preview |
| **7 animation types** | Static · Float · Bounce · Spin · Pulse · Shake · Wobble |
| **6 page templates** | 404 · 500 · 503 · 401 · Coming Soon · Offline |
| **Multi-format export** | React/Next.js (TSX) · HTML · Vue · Astro |
| **Emoji picker** | Full emoji-mart with search |
| **Font selection** | 7 font families |
| **Undo / Redo** | `Cmd+Z` / `Cmd+Shift+Z`, 100-snapshot history |
| **URL sharing** | Full design state encoded in query params |
| **Auto-save** | Persists to localStorage between sessions |

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-based routing, RSC for static shells, Turbopack builds |
| UI | React 19 + Tailwind CSS v4 | Composition model, no runtime CSS-in-JS |
| Animation | Framer Motion 12 | Declarative spring/keyframe API, layout animations |
| Emoji | Emoji Mart 5 | Searchable picker with a self-contained dataset |
| Primitives | Radix UI | Accessible dialog without styling opinions |
| Analytics | Vercel Analytics | Zero-config, edge-native |
| Language | TypeScript 5 (strict) | Catches export schema drift, safe refactors |

---

## Local development

**Prerequisites:** Node.js ≥ 20.9

```bash
git clone https://github.com/your-username/oopsly.git
cd oopsly
npm install
npm run dev
```

Open [http://localhost:3000/generate](http://localhost:3000/generate).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Deployment

The project ships a `vercel.json` that handles the `--legacy-peer-deps` flag automatically.

```bash
vercel deploy
```

No environment variables are required. There is no server-side state.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, Analytics
│   ├── page.tsx            # Landing page
│   ├── not-found.tsx       # App-level 404 fallback
│   ├── generate/
│   │   └── page.tsx        # Builder — all design state lives here
│   ├── preview/
│   │   └── page.tsx        # Read-only shareable preview (reads URL params)
│   ├── about/
│   │   └── page.tsx
│   ├── examples/
│   │   └── page.tsx        # Showcase (upcoming)
│   ├── _data/
│   │   └── presets.json    # Page template definitions
│   └── lib/
│       └── utils.ts
└── components/
    ├── StatusPreview.tsx    # Renders the live 404 preview
    ├── BuilderSidebar.tsx   # All controls — emoji, animation, colors, fonts
    ├── TopBar.tsx           # Toolbar, fullscreen toggle, export trigger
    ├── ExportPanel.tsx      # Generates and displays multi-format code
    ├── Emoji404.tsx         # Reusable animated emoji display
    ├── carouselPics.tsx     # Homepage feature carousel
    └── ui/
        ├── dialog.tsx
        └── carousel.tsx
```

---

## How state flows

```
URL params ──► localStorage ──► React state (generate/page.tsx)
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼             ▼
                   BuilderSidebar  StatusPreview  TopBar
                   (controls)      (live preview) (export)
```

- On load, URL params take priority over localStorage.
- Every state change syncs to both localStorage and the URL via `window.history.replaceState` — no router navigation, no full re-render.
- The `/preview` route is read-only: it reads the same URL params and renders `StatusPreview` alone.

---

## Export format details

Each export is a complete, self-contained snippet with no Oopsly dependency.

| Format | What you get |
|---|---|
| **React / Next.js** | A `.tsx` functional component with inline Tailwind classes |
| **HTML** | A standalone `<html>` page with embedded `<style>` and a CSS keyframe animation |
| **Vue** | A single-file `.vue` component with scoped styles |
| **Astro** | An `.astro` component with a `<style>` block |

---

## Adding a template preset

Presets live in [`src/app/_data/presets.json`](src/app/_data/presets.json). Add an entry:

```json
{
  "id": "unique-id",
  "name": "Display Name",
  "title": "Page heading",
  "message": "Subtext shown below the emoji",
  "emoji": "🚀",
  "background": "bg-gradient-to-br from-blue-100 to-indigo-100",
  "showButton": true,
  "buttonText": "Go Home"
}
```

The builder sidebar picks up new presets automatically.

---

## Contributing

1. Fork and clone
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes and run `npm run lint`
4. Open a pull request against `main`

Please keep PRs focused. One feature or fix per PR.

---

## License

MIT © [Ashish Gogula](https://ashishgogula.vercel.app)
