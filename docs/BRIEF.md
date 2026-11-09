# Engineering Test Project — Short Link Manager

## What you're building

A small but production-quality "short link" web app. Authenticated users can create short links (e.g. `yoursite.com/r/abc123`) that redirect to long URLs, see click counts, and manage their links from a dashboard.

## Why this test exists

We're hiring a full-stack engineer who can ship fast using AI coding tools (Claude Code, Cursor, Codex, etc.). This project is designed to take **1–2 focused days** and shows us:

- How you architect a small Next.js app
- How you handle auth, DB, and server actions
- How clean and polished your UI is
- How effectively you leverage AI coding agents

---

## Stack — REQUIRED, do not substitute

- **Next.js 16** (App Router, TypeScript, `strict: true`)
- **Tailwind CSS v4** + **shadcn/ui** components (install via the shadcn CLI — do not hand-roll primitives)
- **Drizzle ORM** + **Neon Postgres** (free tier, signup is instant, no credit card)
- **Server Components by default**; **Server Actions** for all mutations (no internal API routes)
- **Auth**: Neon Auth
- **Deployment**: Vercel (free tier)
- Package manager: **pnpm**

---

## Features (all required)

### 1. Auth

- Sign up with email + password
- Log in / log out
- Protected `/dashboard` route — unauthenticated users get redirected to `/login`

### 2. Create short link

- Form with: **long URL** (required), **custom slug** (optional, alphanumeric + dashes only), **title** (optional)
- If no slug provided, generate a random 6-character slug
- Slug must be unique per user — show a friendly inline error if taken
- Validate the long URL with Zod on the server (must be a valid `http(s)` URL)

### 3. Dashboard (links list)

- Table or card grid of the user's links: slug, title, destination, click count, created date
- **Copy-to-clipboard** button for the full short URL
- **Delete** button with a confirmation dialog
- A clean empty state when the user has no links

### 4. Redirect endpoint

- Visiting `/r/[slug]` redirects to the destination URL (`307`)
- Increment click count on each successful redirect
- Render a clean **404 page** if the slug doesn't exist

### 5. Link detail page

- `/dashboard/links/[id]` showing: full destination, total clicks, created date
- A simple **"clicks per day" chart for the last 7 days** (use `recharts` or any chart lib you like)

### 6. UI polish

- Fully responsive (mobile + desktop)
- **Dark mode toggle** that actually works (use `next-themes`)
- Loading states (`loading.tsx` skeletons, not blocking spinners)
- Toast notifications for success/error (use `sonner`)

---

## Non-negotiables

- TypeScript strict — **no `any`**
- **All inputs validated with Zod**
- **Server Actions for all mutations** — no internal API routes
- **No DB calls inside React components** — abstract into `src/lib/db/` or a small `core` module
- No raw DB or auth errors leaked to the client — return `{ data, error }`-shaped results
- Every route segment has `loading.tsx` and `error.tsx` boundaries
- All secrets in `.env.local`, **never committed**
- Repo includes a `.env.example` with every required variable
- Repo includes a real `README.md` (see Deliverables)

---

## Deliverables

1. **GitHub repo URL** — public, or private with `<your-github-handle>` added as a collaborator
2. **Deployed URL** on Vercel (or any free host) — must be reachable, with auth working end-to-end
3. **README.md** that includes:
   - Local setup steps (`pnpm install`, env vars needed, how to run migrations, `pnpm dev`)
   - The deployed URL
   - **A section titled "How I used AI tools"** — 100–300 words on which tools you used, which parts you wrote vs generated, what worked, what didn't, where AI tripped you up
4. **Commit history that tells a story** — small, descriptive commits, not one giant `init` dump

---

## Time

- **Target:** 1–2 days of focused work (~8–16 hours total)
- **Hard deadline:** 5 calendar days from when you receive this brief
- If you can't finish a feature in time, **ship what you have** and explain in the README what's missing and why

---

## How we evaluate (in order of importance)

1. **Does it actually work?** Sign up → create link → click short URL → see the count go up.
2. **Code quality** — folder structure, separation of concerns (UI / actions / data), type safety, no dead code, no commented-out blocks
3. **UI/UX polish** — does it look like something a person would actually use?
4. **AI leverage** — your README write-up and commit history show how you actually work day-to-day
5. **Speed** — what you got done in the time window

---

## Tips

- Use the **shadcn CLI** to add components — don't hand-roll buttons, inputs, dialogs, toasts
- Neon free tier: create a project, copy the connection string, done
- Vercel preview deploys from `main` are fine — no fancy CI required
- If you get stuck on something for more than 30 minutes, ship a partial version with a clear `TODO` and move on
- Commit early, commit often — small focused commits beat one giant push

---

## What NOT to do

- Don't add features we didn't ask for (no teams, no paid plans, no analytics dashboards, no QR codes)
- Don't over-engineer (no microservices, no tRPC, no GraphQL, no Redis, no Docker)
- Don't skip auth "to save time" — it's a required feature
- Don't disable TypeScript strict mode or sprinkle `// @ts-ignore`
- Don't ghost — if you decide to drop out, send a one-line email

---

## Questions

**Don't ask any.** If something is ambiguous, make a reasonable choice and document it in the README under a "Decisions I made" section. Resolving ambiguity yourself is part of the test.

Good luck — we're excited to see what you ship.
