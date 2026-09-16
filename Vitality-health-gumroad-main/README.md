# VitaCore (Vitality Program)

Modern **Node.js** app using **Next.js (App Router)** + **Prisma** (SQLite) + **Zod**.

## Local setup (Windows / PowerShell)

1) Install dependencies

```bash
npm install
```

2) Create `.env` in the project root

Set:

```txt
DATABASE_URL="file:./prisma/dev.db"
```

(There’s a copy in `ENV_EXAMPLE.txt`.)

3) Create the database + Prisma client

```bash
npm run db:migrate
```

4) Run the app

```bash
npm run dev
```

## What’s implemented

- **Landing page**: `/` (your provided HTML/CSS converted into React)
- **Signup API**: `POST /api/signup` (stores a `Lead` in SQLite)
- **Dashboard**: `/dashboard?leadId=...` (basic post-signup page)

## Project structure

- `app/` — Next.js routes (UI + API)
- `components/` — client UI components (landing page logic)
- `lib/` — Prisma client + validation
- `prisma/` — schema + migrations (created after running migrate)


