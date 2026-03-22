# Budgetly

A personal finance web application built as a Final Year Project at the University of Salford. Budgetly gives users a clear, calm view of their finances — tracking transactions, budgets, net worth, and spending limits in one place.

**Live demo:** [fy-project-budgetly.vercel.app](https://fy-project-budgetly.vercel.app)

---

## Features

- **Dashboard** — balance sparkline, income/spending trend chart, recent transactions, and budget overview at a glance
- **Transactions** — add, edit, search, filter, and paginate transactions; CSV import from bank statements
- **Budgets** — SPEND and SAVE budget types with progress tracking, add/withdraw flows, and recent adjustment history
- **Spending Limits** — monthly category caps that reset automatically
- **Net Worth** — track assets and liabilities over time with a historical chart
- **Authentication** — email/password registration and Google OAuth via NextAuth.js
- **Email** — welcome email on registration, forgot password flow, and change password confirmation via Resend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma v7 |
| Auth | NextAuth.js |
| Email | Resend |
| Animations | Framer Motion |
| Charts | Recharts |
| Deployment | Vercel |

---

## Running Locally

### Prerequisites

- Node.js 18+
- A PostgreSQL database (or a free [Neon](https://neon.tech) project)
- A [Resend](https://resend.com) account for transactional emails
- Google OAuth credentials (optional, for Google sign-in)

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

3. **Create a `.env.local` file** in the project root with the following variables:

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

The app will be available at [http://localhost:3000](http://localhost:3000).

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

## Deployment

The application is deployed on **Vercel** with a **Neon PostgreSQL** database.

To deploy your own instance:

1. Fork the repository and import it into [Vercel](https://vercel.com)
2. Add all environment variables listed above in the Vercel project settings
3. Set `NEXTAUTH_URL` to your Vercel deployment URL
4. Vercel will automatically build and deploy on every push to `main`

> **Note:** Email functionality requires a verified domain on Resend. Until a domain is verified, emails can only be sent to the Resend account's own verified address.

---

## Project Structure

```
budgetly/
├── app/
│   ├── (app)/          # Authenticated app pages (dashboard, transactions, budgets)
│   ├── (marketing)/    # Public landing page
│   └── api/            # API routes
├── components/         # Reusable UI components
├── lib/                # Utilities, Prisma client, email helpers
├── prisma/             # Schema and migrations
└── public/             # Static assets
```

---

## Academic Context

This project was developed as a Final Year Project at the **University of Salford**, supervised by Sadaqat. It is hosted publicly at [fy-project-budgetly.vercel.app](https://fy-project-budgetly.vercel.app) for assessment purposes.
