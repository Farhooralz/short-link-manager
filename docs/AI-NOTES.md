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