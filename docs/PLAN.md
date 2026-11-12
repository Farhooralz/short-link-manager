# Implementation Plan

Spec: docs/BRIEF.md. Rules: AGENTS.md. Work one phase at a time. Each phase ends
with something runnable and a commit.

## Decisions (also go in README "Decisions I made")
1. Slugs are globally unique (not per user), because /r/[slug] has no user context.
   This satisfies "unique per user".
2. Custom slugs: 3-50 chars, [a-zA-Z0-9-], case-sensitive. Generated slugs: 6
   random alphanumeric chars, retried on collision.
3. Title max 100 chars. URL max 2048 chars, http(s) only.
4. /r/[slug] is a route handler (the single allowed exception to "no API routes"),
   returning 307. Every visit to an existing slug counts as a click (bots included).
5. Clicks are stored one row per click (needed for the 7-day chart). The count on
   the dashboard is an aggregate.
6. Deleting a link cascades to its clicks.
7. Chart days use UTC; missing days are filled with 0.
8. Auth user id type and session API: confirm from Neon Auth docs before writing code.
9. Neon Auth requires a proxy route handler at /api/auth/[...path]. This is a library
   requirement, not an app API; all app mutations remain Server Actions.
10. Cache Components is disabled (the scaffold enabled it). The app reads the session on
    every request, so it renders dynamically, as the standard Neon Auth setup assumes.
11. Unknown slugs at /r/[slug] return a small inline HTML 404 from the route handler, because
    notFound() in a route handler sends a 404 with no body (the browser shows its own error
    page). Pages elsewhere use app/not-found.tsx.
12. v2 uses next-intl with prefix-always locale routing (/en/..., later /fa/...). proxy.ts sends
    locale-prefixed /dashboard routes to Neon's guard (session refresh + login redirect) and
    everything else to next-intl. /api/* and /r/* are excluded from locale routing.
13. Home, login and signup don't read the session. Server Components can't refresh Neon's
    5-minute session cache cookie, so getSession() there throws on a stale cookie. Trade-off: a
    logged-in visitor on /login sees the form. To be revisited with the landing page.
14. App routes use `Link` from @/i18n/navigation and `redirectTo` from @/i18n/redirect-to.
    next-intl's own redirect() isn't typed `never`, which broke session null-narrowing.

## Schema
links:  id (uuid pk), user_id (text, from Neon Auth), slug (text UNIQUE), url (text),
        title (text null), created_at (timestamptz default now)
clicks: id (uuid pk), link_id (fk -> links.id ON DELETE CASCADE),
        clicked_at (timestamptz default now)
Indexes: links(user_id), clicks(link_id, clicked_at)

## Folder structure
src/
  proxy.ts                      route protection (Next 16 replaced middleware)
  app/
    layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx
    login/ , signup/            page + loading.tsx + error.tsx each
    dashboard/                  layout.tsx (session check), page.tsx, loading.tsx, error.tsx
      links/[id]/               page.tsx, loading.tsx, error.tsx
    r/[slug]/route.ts           redirect + click tracking
  actions/                      auth.ts, links.ts (Server Actions only)
  components/
    ui/                         shadcn (CLI only)
    links/                      create-link-form, links-table, copy-button, delete-link-dialog
    charts/clicks-chart.tsx
    theme-provider.tsx, theme-toggle.tsx
  lib/
    db/                         index.ts, schema.ts, links.ts, clicks.ts
    validation/                 auth.ts, link.ts
    result.ts                   ActionResult<T> = { data, error }
    slug.ts                     random slug generator
drizzle/                        generated migrations
drizzle.config.ts

## Phases
1. Foundation: add shadcn/ui + components (button, input, label, card, dialog/alert-dialog,
   table, skeleton, sonner), .env.example, confirm tsconfig strict. Commit.
2. Database: Drizzle + Neon driver, schema, first migration applied. Commit.
3. Auth: Neon Auth sign up / login / logout, proxy.ts + layout session check,
   protected /dashboard. Commit.
4. Create link: Zod schema, slug generator, db functions, createLinkAction, form,
   inline errors, toast. Commit.
5. Dashboard: links list with click counts, copy button, delete with confirmation,
   empty state, loading + error boundaries. Commit.
6. Redirect: /r/[slug] 307, click recording, 404 for unknown slug. Commit.
7. Link detail: /dashboard/links/[id], totals, 7-day chart with recharts. Commit.
8. Polish: next-themes dark mode toggle, loading/error.tsx on every segment,
   responsive pass, toasts on all paths. Commit.
9. Audit + refactor: review against BRIEF "Non-negotiables", fix findings,
   remove dead code. Commit.
10. Ship: README (setup, deployed URL, Decisions, "How I used AI tools"),
    Vercel deploy, env vars, end-to-end test on production. Commit.

## Per-phase checklist
- pnpm lint and pnpm tsc --noEmit pass
- Feature tested by hand in the browser
- No secrets committed; .env.example updated
- One line added to docs/AI-NOTES.md (what the AI got wrong or did well)

## v2 (branch feat/v2; v1 is tagged v1-submission)

Rules: all DB migrations are additive (new nullable columns/tables only), because main shares
the same Neon database. One commit per phase. Every new feature ships in EN and FA.

Structure changes: pages live under src/app/[locale]/; src/i18n/ (routing, request, navigation,
redirect-to); messages/ (one JSON file per locale).

### Phases
- [x] 1. i18n routing (next-intl, pages under [locale], locale-aware links and redirects)
- [ ] 2. i18n messages (typed keys, translated action errors and Zod messages)
- [ ] 3. Farsi + RTL (fa.json, Vazirmatn, logical classes, switcher, Jalali dates)
- [ ] 4. Design system + app shell (tokens, sidebar, motion)
- [ ] 5. Dashboard overview (stats, trend, top links, 30-day chart)
- [ ] 6. Richer analytics (device, browser, country, referrer; additive migration)
- [ ] 7. QR codes (PNG/SVG download)
- [ ] 8. Link controls (expiry, click limit, on/off; additive migration)
- [ ] 9. Search, sort, filter + CSV export
- [ ] 10. Command palette (⌘K)
- [ ] 11. Landing page (bilingual, SEO, hreflang, OG image)
- [ ] 12. Hardening (audit, README update, preview deploy, merge decision)