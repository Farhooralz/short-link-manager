# Short Link Manager
Spec: docs/BRIEF.md. Plan: docs/PLAN.md. Work one phase at a time.

## Stack (required, no substitutions)
Next.js 16 App Router, TypeScript strict (no `any`, no @ts-ignore), Tailwind v4,
shadcn/ui (add via CLI only), Drizzle ORM + Neon Postgres, Neon Auth, Zod,
sonner, next-themes, recharts, pnpm only.

## Architecture
- Server Components by default; "use client" only when needed
- Mutations are Server Actions in src/actions/. No internal API routes.
  Only Exceptions: the /r/[slug] redirect route handler and the Neon Auth proxy at /api/auth/[...path]
- All DB access lives in src/lib/db/. Never in components
- Actions return { data, error } and never leak raw DB/auth errors
- All input validated with Zod (schemas in src/lib/validation/)
- Every route segment has loading.tsx and error.tsx

## Rules
- Next.js 16 and Neon Auth are new. Fetch and read the official docs before
  using any API. Never guess. If the docs are unclear, tell me
- Secrets only in .env.local; keep .env.example in sync
- One task per request. Ask before adding dependencies or extra features
- No dead code, no commented-out code
- Before saying a task is done, run `pnpm lint` and `pnpm tsc --noEmit`
- Check next.config.ts before using any Next.js feature from docs (Cache Components is off).
- App routes: use `Link` from @/i18n/navigation and `redirectTo` from @/i18n/redirect-to, never
  `next/link` or next-intl's `redirect`. Public pages must not call auth.getSession().

## Don'ts
No teams, plans, analytics dashboards, QR codes, Redis, tRPC, GraphQL, Docker.