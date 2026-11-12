# AI notes
- Tools: OpenCode (DeepSeek V4.1 Flash Free) for an initial planning attempt; Claude (chat) for
  planning, architecture and code generation, which I ran, read and tested myself.
- Phase 1: the free model in OpenCode got stuck probing the shadcn CLI source in a /tmp copy
  instead of just running `shadcn init`. Mechanical setup is faster by hand.
- Phase 2: I pressed Enter in `pnpm approve-builds` without selecting anything, which marked
  esbuild builds as disabled. Migrations still worked; I checked before "fixing" it.
- Phase 3: the AI copied `export const dynamic = "force-dynamic"` from the Neon docs, but the
  scaffold had Cache Components (and the dependent Partial Prefetching) enabled in
  next.config.ts, which rejects it. Lint and tsc passed; only running the app caught it.
  Lesson: docs examples assume default config, so check next.config.ts.
- Phase 5: I asked the AI to "append at the bottom" of links.ts and the instruction was ambiguous
  enough that I got stuck; asking for the whole file fixed it. Lesson: for edits, ask for the
  complete file or an exact anchor line.
- Phase 5: `tsc` failed with "separate declarations of a private property" because pnpm had
  installed drizzle-orm twice (one copy with a kysely peer, pulled in by the auth library, and
  one without). [`pnpm dedupe` fixed it / I added kysely as a direct dependency.] Earlier phases
  passed because no SQL helpers had been imported yet.
- Phase 6: the AI used `notFound()` in the route handler based on the Next docs saying it
  "serves a 404". In the browser it was a blank default error page; the docs never promised a
  styled page, and I only found out by opening the URL. Replaced with an explicit HTML 404 response.
- Phase 8: full-file replacements from the AI silently dropped `export const dynamic = "force-dynamic"`
  from three pages. Lint, tsc and the browser all looked fine; `pnpm build` printed prerender errors
  from the auth SDK. Lesson: run `pnpm build` and read `git diff` after any full-file replacement,
  because dropped lines don't show up as errors.

## v2

- Phase 1: the AI used next-intl's `redirect()`, which isn't typed `never`, so TypeScript lost the
  `session` null-narrowing in five places. Lint passed; only `tsc` caught it. I also had stale
  generated types in `.next/dev` from before the folder move; deleting `.next` fixed those.
  Fix: a small `redirectTo` helper built on Next's own `redirect`.
- Phase 1: the AI removed `auth.middleware` from `proxy.ts` to simplify i18n routing. Neon's docs
  say that middleware refreshes the 5-minute session cache cookie, and Server Components can't
  write cookies, so `getSession()` threw on a stale cookie. My quick manual tests all passed
  because the cookie was fresh. Lesson: time-dependent behavior needs a time-based test (I
  shortened `sessionDataTtl` to 10s to reproduce it, then reverted). Fix: dashboard routes use
  Neon's guard again, composed with next-intl in `proxy.ts`, and the public pages no longer read
  the session.
- Phase 1: the same stale-cookie bug probably exists in v1 (`main`), where public pages also
  called `getSession()` without the middleware covering them.