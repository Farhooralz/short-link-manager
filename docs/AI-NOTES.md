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