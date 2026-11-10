# Short Link Manager

A small short-link app: sign up, create short links that redirect to long URLs, see click
counts, and manage everything from a dashboard.

**Live:** https://YOUR-DEPLOYED-URL.vercel.app

## Features

- Email + password auth (Neon Auth); `/dashboard` is protected
- Create links with an optional custom slug and title (random 6-character slug otherwise)
- Dashboard with click counts, copy-to-clipboard, delete with confirmation, and an empty state
- `/r/[slug]` redirects with a `307`, counts the click, and returns a styled 404 for unknown slugs
- Link detail page with a "clicks per day" chart for the last 7 days
- Responsive layout, dark mode, loading skeletons, error boundaries, toasts

## Stack

Next.js 16 (App Router, TypeScript strict) · Tailwind CSS v4 · shadcn/ui · Drizzle ORM ·
Neon Postgres · Neon Auth · Zod · recharts · next-themes · sonner · pnpm · Vercel

## Local setup

Requires Node.js 20.9+, pnpm, and a free [Neon](https://neon.com) project with Auth enabled.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm db:migrate              # applies the SQL in ./drizzle to your Neon database
pnpm dev                     # http://localhost:3000
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon console → Connect → connection string |
| `NEON_AUTH_BASE_URL` | Neon console → Auth → Configuration (the Auth URL) |
| `NEON_AUTH_COOKIE_SECRET` | `openssl rand -base64 32` |

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm db:generate` (after schema changes).

For a deployed environment, add the app's origin (with `https://`) under Neon console →
Auth → Configuration → Domains.

## Project structure

```
src/
  app/            routes: /, /login, /signup, /dashboard, /dashboard/links/[id], /r/[slug]
  actions/        Server Actions (auth, links)
  components/     UI (links/, auth/, charts/, ui/ = shadcn)
  lib/db/         all database access (schema + queries)
  lib/validation/ Zod schemas
  lib/auth/       Neon Auth server instance
  proxy.ts        route protection for /dashboard
docs/             brief, implementation plan, notes on working with AI
```

## Decisions I made

- **Slugs are globally unique**, not per user, because `/r/[slug]` has no user context. This
  still satisfies "unique per user". Uniqueness is enforced by the database
  (`INSERT ... ON CONFLICT DO NOTHING`), so concurrent requests can't both win.
- Custom slugs are 3-50 characters (`[a-zA-Z0-9-]`), case-sensitive. Titles max 100 characters.
- **Two route handlers exist, despite "no internal API routes":** `/r/[slug]` (a redirect has to
  be a route handler to return a real `307`) and `/api/auth/[...path]` (required by Neon Auth).
  All app mutations are Server Actions.
- Clicks are stored one row per click so the chart can group them; the dashboard count is an
  aggregate. Every request to `/r/[slug]` counts, including bots and link-preview fetchers.
- Clicks are recorded with `after()`, so the redirect isn't delayed and a failed insert can't
  break it.
- Unknown slugs get a small inline HTML 404 from the route handler, because `notFound()` in a
  route handler returns an empty 404 (the browser shows its own error page).
- Chart days are UTC, with missing days filled with 0. The total on the detail page is all-time.
- Cache Components is disabled (the scaffold enabled it): pages read the session on every request.
- Email verification is off; the brief only asks for email + password.
- `kysely` is a direct dependency only to make pnpm install a single copy of `drizzle-orm`
  (two copies caused a TypeScript type mismatch).
- Local and deployed environments share one Neon database.

## Known limitations

- No automated tests (not requested in the brief).
- `loading.tsx` / `error.tsx` exist for every route segment that renders UI; the two route
  handlers have no UI, so they have none.

## How I used AI tools

REWRITE THIS IN YOUR OWN WORDS (100-300 words). Draft based on what happened:

I used Claude (chat) as my main pair programmer and tried OpenCode with a free DeepSeek model
briefly. Claude turned the brief into a phased plan (`docs/PLAN.md`) and an agent rules file
(`AGENTS.md`), then generated the code one phase at a time. I ran each phase, read the diffs,
tested it in the browser, and committed. Setup (Neon, Vercel, env vars, migrations) and
debugging were done by me in the terminal. [Add what you wrote or changed yourself.]

What worked: small phases with a commit each, asking for the Neon Auth docs to be read before
any code, and an audit pass against the brief's non-negotiables at the end.

Where AI tripped me up: the free model got stuck probing the shadcn CLI, so I ran setup by hand;
a docs example (`force-dynamic`) was incompatible with the Cache Components setting the scaffold
had enabled, and lint and tsc passed so only running the app caught it; `notFound()` in a route
handler produced a blank browser error page instead of a styled 404; pnpm installed drizzle-orm
twice, causing a type error; a full-file rewrite silently dropped a line, which only `pnpm build`
revealed; and the audit script I was given used globs that zsh rejects, so some checks printed
"none" without running. More notes are in `docs/AI-NOTES.md`.