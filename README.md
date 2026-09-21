# Wisdom In The Streets — Podcast Website

> **Real Wisdom. Real Streets. Real Talk.** A motivational podcast hosted by **Marvin Marbell**, recorded at street level in Accra, Ghana.

A production-ready, fully responsive podcast website: persistent audio player, episode archive with search/filter/sort, quotes library with PNG export, host story, contact + guest applications, dark/light themes, and SEO scaffolding.

---

## Tech stack

| Layer            | Choice                                                        |
| ---------------- | ------------------------------------------------------------- |
| Frontend         | React 18 + TypeScript + Vite                                  |
| Routing          | react-router-dom (hash routing — static-host friendly)        |
| Animation        | Framer Motion (+ CSS keyframes, `prefers-reduced-motion` safe)|
| State            | Zustand (player, favorites, bookmarks, history, theme, toasts)|
| Styling          | Tailwind CSS v4 with runtime CSS-variable theming             |
| Audio            | Module-level `<audio>` singleton — playback survives navigation |
| Data             | Typed mock layer in `src/data/content.ts` (API-ready shapes)  |
| Deployment       | Vercel / Netlify ready (`npm run build` → `dist/`)            |

## Getting started

```bash
npm install
npm run dev        # local development
npm run build      # production build → dist/
npm run typecheck  # strict TS check
```

## Project structure

```
src/
  App.tsx                  # router, shell, theme sync, audio wiring
  store.ts                 # Zustand store + shared audio element
  data/content.ts          # 10 episodes, 20 quotes, host, stats, links
  components/
    icons.tsx              # hand-drawn inline SVG icon set
    ui.tsx                 # Reveal, SectionHead, typewriter, count-up,
                           # marquee, particles canvas, toasts
    cards.tsx              # CoverArt (procedural), EpisodeCard, QuoteCard,
                           # ShareRow, NewsletterForm, canvas → PNG quotes
    chrome.tsx             # Header, Footer, ScrollToTop, ErrorBoundary
    PlayerBar.tsx          # sticky player, MiniPlayer, ProgressBar, AuxControls
  pages/
    Home.tsx Episodes.tsx EpisodeDetail.tsx About.tsx Quotes.tsx Contact.tsx
public/
  robots.txt sitemap.xml
```

## Feature map

- **Persistent player** — play/pause across pages, ±15s skip, scrub bar, volume, speeds 0.5×–2×, prev/next through queue, Space/←/→ keyboard shortcuts, share-link-with-timestamp, resume point saved to localStorage.
- **User features** — favorites ♥, listening history, per-episode bookmarks, continue-listening chip, dark/light theme (default dark).
- **Episodes** — search by title/guest/tag, category + favorites filters, newest/oldest/popular sort, skeleton loading, deep-linkable show-note timestamps (`/#/episode/4?t=95`), guest bios, transcript excerpt, related episodes, blob download with fallback.
- **Quotes** — topic filters, copy to clipboard, canvas-rendered PNG download (no heavy deps), WhatsApp share.
- **Contact** — validated form with guest-application mode, WhatsApp click-to-chat (`024 992 6969` → `wa.me/233249926969`), platform + social links.
- **Accessibility** — ARIA labels/roles, focus-visible outlines, keyboard-navigable player & slider, live regions for toasts, reduced-motion fallbacks.
- **SEO** — per-route titles/descriptions, Open Graph + Twitter cards, PodcastSeries JSON-LD, `robots.txt`, `sitemap.xml`.

## Going to production (integration points)

All integration points are isolated and env-driven — swap the mock layer without touching UI:

1. **Database** — replace `src/data/content.ts` with `GET /api/episodes`, `GET /api/quotes` (PostgreSQL schema sketch below).
2. **Contact form** — point the submit handler at Formspree/Nodemailer (`VITE_FORM_ENDPOINT`).
3. **Newsletter** — point `NewsletterForm` at your Mailchimp/ConvertKit action URL (`VITE_NEWSLETTER_ACTION`).
4. **Audio hosting** — swap `audioUrl` per episode for Spotify/Apple/YouTube hosted MP3s; embeds ready.
5. **Analytics** — add GA4 tag id via `VITE_GA_ID` in `index.html`.

### Suggested PostgreSQL schema

```sql
CREATE TABLE episodes (
  id            SERIAL PRIMARY KEY,
  num           TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  tags          TEXT[],
  released_on   DATE NOT NULL,
  duration_secs INT NOT NULL,
  plays         INT DEFAULT 0,
  audio_url     TEXT NOT NULL,
  blurb         TEXT,
  description   TEXT,
  show_notes    JSONB DEFAULT '[]',
  guest_id      INT REFERENCES guests(id)
);

CREATE TABLE guests (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  role   TEXT,
  bio    TEXT,
  handle TEXT,
  url    TEXT
);

CREATE TABLE quotes (
  id       SERIAL PRIMARY KEY,
  text     TEXT NOT NULL,
  author   TEXT NOT NULL,
  episode  TEXT NOT NULL,
  topic    TEXT NOT NULL
);
```

## Environment variables

See [`.env.example`](./.env.example).

Before deploying, set `VITE_FORM_ENDPOINT` to a live JSON-compatible form endpoint
(such as Formspree) and `VITE_NEWSLETTER_ACTION` to a live newsletter endpoint.
The site intentionally reports a configuration error when either endpoint is
missing or still contains the placeholder values; it never claims a message or
subscription was delivered unless the request succeeds.

### Admin publishing

The private publishing desk is available at `/#/admin` after Supabase is configured.
Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor, add
an admin user under Authentication, and set `VITE_SUPABASE_URL` plus
`VITE_SUPABASE_ANON_KEY` in the hosting provider. The admin can publish podcast
episodes, quotes, image URLs, and video URLs; public pages retain the built-in
catalog as a fallback and overlay published records from Supabase.

## Deployment

- **Vercel**: import repo → framework Vite → build `npm run build`, output `dist`.
- **Netlify**: same, plus `publish = "dist"`. Hash routing means no rewrite rules needed.

---

*Built on the corner — Accra → everywhere.*
