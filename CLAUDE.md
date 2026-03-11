# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

**Prisma:**
```bash
npx prisma migrate dev    # Run migrations (dev)
npx prisma generate       # Regenerate Prisma client after schema changes
npx prisma studio         # Open DB browser
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Architecture

### Route Groups
- `app/(marketing)/` — public-facing landing page (unauthenticated)
- `app/(app)/` — authenticated app shell with `AppNav` sidebar and dual context providers

### Authentication
- NextAuth v4 configured in `auth.ts` with Google OAuth + email/password (bcrypt)
- Session strategy: JWT. User ID is propagated via `token.id` / `token.sub`
- `lib/auth.ts` exports `getAuthSession()` — the single helper used in Server Components and API routes
- `middleware.ts` protects `/dashboard`, `/budgets`, and `/transactions` routes

### Data Flow Pattern
Pages follow a consistent server → client pattern:
1. `page.tsx` (Server Component) calls `lib/db/*.ts` to fetch data and maps Prisma rows to plain `types/*.ts` objects
2. Data is passed as `initialProps` to a `*Client.tsx` (Client Component)
3. The Client Component syncs the data into `BudgetsContext` or `TransactionsContext` on mount

### Client State
`context/BudgetsContext.tsx` and `context/TransactionsContext.tsx` manage global client state with localStorage persistence. Storage keys are scoped per user ID (`budgetly:budgets:<userId>`) to prevent cross-user data leakage.

### API Routes (`app/api/`)
REST endpoints for mutations (create/update/delete). Every route calls `getAuthSession()` and returns 401 if unauthenticated. Business logic for reading lives in `lib/db/`. Writes happen directly in the route handler, often inside a `prisma.$transaction`.

### Database
SQLite via `better-sqlite3` + Prisma. Schema in `prisma/schema.prisma`. Key models:
- `User` — auth fields + optional `passwordHash`
- `Budget` — `SPEND` or `SAVE` kind, tracks `balance` and optional `target`
- `BudgetEvent` — immutable delta log for a budget's balance history
- `Transaction` — income/expense/transfer; `source` distinguishes ACCOUNT vs BUDGET transactions

### Key Utilities (`lib/`)
- `lib/db/budgets.ts`, `lib/db/transactions.ts` — Prisma query functions (server-only)
- `lib/auth.ts` — `getAuthSession()` wrapper
- `lib/utils.ts` — `cn()` for Tailwind class merging
- `lib/transactions/` and `lib/budgets/` — pure functions for filtering, charting, and stats (used in Client Components)

### Component Structure
- `components/ui/` — generic primitives (card, chart)
- `components/budgets/`, `components/transactions/`, `components/dashboard/` — feature-specific components
- `components/AppNav.tsx`, `components/Header.tsx` — app shell

### Styling
Tailwind CSS v4 with `prettier-plugin-tailwindcss` for class sorting. Use `cn()` from `lib/utils.ts` for conditional class merging.
