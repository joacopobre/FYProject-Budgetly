
# Budgetly

> A full-stack personal finance app built with Next.js 15, TypeScript, and PostgreSQL — featuring real-time budget tracking, CSV bank import, Google OAuth, and transactional email.

**[→ Live Demo](https://budgetly.uk/)**

<img width="1713" height="1087" alt="Screenshot 2026-05-18 at 18 04 06" src="https://github.com/user-attachments/assets/63ad7af5-5700-4238-b75a-1abb7ca4ec48" />

---

## Overview

Most budgeting tools are either too simple or too overwhelming. Budgetly sits in the middle — giving users a clean, focused view of their finances across transactions, budgets, spending limits, and net worth, all in one place.

Built as a Final Year Project at the **University of Salford**, this is a production-grade application deployed on Vercel with a serverless Neon PostgreSQL database.

---

## Screenshots

<img width="1712" height="1081" alt="Screenshot 2026-05-18 at 18 06 58" src="https://github.com/user-attachments/assets/71622dc9-7a96-4494-b76c-f80f1dcb36c3" />
<img width="1711" height="1084" alt="Screenshot 2026-05-18 at 18 08 05" src="https://github.com/user-attachments/assets/07f65fb7-8be3-4ed5-9ce6-d11954fb324c" />
<img width="1712" height="1083" alt="Screenshot 2026-05-18 at 18 08 25" src="https://github.com/user-attachments/assets/855601f2-8be6-44c4-a268-8c62a83e2bd1" />

---

## Features

- **Dashboard** — balance sparkline, income vs. spending trend chart, recent transactions, and budget overview at a glance
- **Transactions** — add, edit, search, filter, and paginate transactions with CSV import from real bank statements
- **Budgets** — SPEND and SAVE budget types with progress tracking, add/withdraw flows, and adjustment history
- **Spending Limits** — monthly category caps that reset automatically each month
- **Net Worth** — track assets and liabilities over time with a historical chart
- **Authentication** — email/password sign-up and Google OAuth via NextAuth.js
- **Transactional Email** — welcome email on registration, forgot-password flow, and password-change confirmation via Resend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma v7 |
| Auth | NextAuth.js |
| Email | Resend |
| Animations | Framer Motion |
| Charts | Recharts |
| Deployment | Vercel |

---

## Architecture Highlights

- **App Router with route groups** — separates authenticated app pages `(app)` from the public marketing site `(marketing)`, keeping layouts and middleware clean
- **Serverless-first database** — Neon PostgreSQL scales to zero between requests, making it a good fit for a Vercel deployment without cold-start concerns on the DB side
- **CSV bank import** — parses real exported bank statements and normalises them into the transaction schema, handling edge cases like duplicate detection
- **Automatic spending limit resets** — monthly caps are recalculated on the server rather than stored as static values, avoiding stale state

---

## Project Structure

```
budgetly/
├── app/
│   ├── (app)/          # Authenticated pages: dashboard, transactions, budgets, net worth
│   ├── (marketing)/    # Public landing page
│   └── api/            # API route handlers
├── components/         # Reusable UI components
├── lib/                # Utilities, Prisma client, email helpers
├── prisma/             # Schema and migrations
└── public/             # Static assets
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- A PostgreSQL database (or a free [Neon](https://neon.tech) project)
- A [Resend](https://resend.com) account for transactional emails
- Google OAuth credentials (optional — only needed for Google sign-in)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/joacopobre/FYProject-Budgetly.git
cd FYProject-Budgetly/budgetly
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env.local` file** in the project root:

```env
DATABASE_URL=postgresql://your_user:your_password@your_host/your_db?sslmode=require

NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RESEND_API_KEY=your_resend_api_key
```

4. **Generate the Prisma client and run migrations**

```bash
npx prisma generate
npx prisma migrate deploy
```

5. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session encryption |
| `NEXTAUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `RESEND_API_KEY` | Resend API key for transactional emails |

---

## Deploying Your Own Instance

The app is deployed on **Vercel** with a **Neon PostgreSQL** database.

1. Fork the repository and import it into [Vercel](https://vercel.com)
2. Add all environment variables above in the Vercel project settings
3. Set `NEXTAUTH_URL` to your Vercel deployment URL
4. Vercel will automatically build and deploy on every push to `main`

> **Note:** Email functionality requires a verified domain on Resend. Until a domain is verified, emails can only be sent to the Resend account's own address.

---

## What I'd Improve Next

- End-to-end tests with Playwright covering the core transaction and budget flows
- API rate limiting to protect auth and data mutation endpoints
- Optimistic UI updates for a snappier feel on transaction edits
- Recurring transaction support with automatic scheduling
