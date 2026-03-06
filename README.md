# MiniTodo

A modern, full-stack task management application built with **Next.js 16**, **tRPC**, **Prisma**, and **NextAuth.js**. Designed for simplicity, performance, and a delightful user experience.

> **Live on Vercel** — This project is deployed and hosted on [Vercel](https://simplytodo.vercel.app).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Layer (tRPC)](#api-layer-trpc)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ✅ **Task Management** — Create, update, and track tasks with statuses (`Pending`, `In Progress`, `Done`)
- 🔐 **Authentication** — Credentials and Google OAuth via NextAuth.js v5 (Auth.js)
- 🛡️ **Role-Based Access** — `USER`, `MANAGER`, and `ADMIN` roles with scoped dashboards
- 📋 **Admin Dashboard** — Manage users and tasks across the platform
- 📝 **Audit Logging** — Track entity-level changes with a dedicated audit log
- 🔑 **Password Recovery** — Forgot password and reset password flows via email
- 🎨 **Shadcn/ui Components** — Polished UI with Radix primitives and Tailwind CSS v4
- ⚡ **End-to-End Type Safety** — tRPC + Zod schemas shared across client and server
- 🗄️ **PostgreSQL** — Prisma ORM with migration support and generated client

---

## Tech Stack

| Layer          | Technology                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org) (App Router)                                   |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org)                                  |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn/ui](https://ui.shadcn.com) |
| **API**        | [tRPC v11](https://trpc.io) with [React Query v5](https://tanstack.com/query)   |
| **Auth**       | [NextAuth.js v5](https://authjs.dev) (Credentials + Google OAuth)               |
| **ORM**        | [Prisma v7](https://www.prisma.io) with PostgreSQL adapter                      |
| **Database**   | [PostgreSQL](https://www.postgresql.org)                                        |
| **Validation** | [Zod v4](https://zod.dev)                                                       |
| **Email**      | [Nodemailer](https://nodemailer.com)                                            |
| **Hosting**    | [Vercel](https://vercel.com)                                                    |

---

## Architecture Overview

```
Client (React 19)
  │
  ├─ tRPC React Query hooks ──► tRPC Server (Next.js API route)
  │                                  │
  │                                  ├─ Prisma Client ──► PostgreSQL
  │                                  └─ Auth middleware (NextAuth.js)
  │
  └─ Server Actions (auth flows, password reset)
```

The application follows a **monolithic full-stack architecture** within a single Next.js project. The tRPC layer provides end-to-end type-safe RPC calls between client and server, while Prisma handles all database operations through a generated, type-safe client.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** (or yarn / pnpm)
- **PostgreSQL** instance (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))

### Installation

```bash
git clone https://github.com/rubelamin/minitodo.git
cd minitodo
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"

# NextAuth.js
AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
AUTH_URL="http://localhost:3000"

# Google OAuth (optional — required for Google sign-in)
AUTH_GOOGLE_ID="<your-google-client-id>"
AUTH_GOOGLE_SECRET="<your-google-client-secret>"

# Email (Nodemailer — for password reset)
SMTP_HOST="<smtp-host>"
SMTP_PORT=587
SMTP_USER="<smtp-user>"
SMTP_PASS="<smtp-password>"
EMAIL_FROM="noreply@yourdomain.com"
```

> **Note:** Never commit your `.env` file. It is already included in `.gitignore`.

### Database Setup

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate deploy    # production / CI
npx prisma migrate dev       # local development (creates + applies migrations)
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app supports hot module replacement — edits are reflected instantly.

---

## Project Structure

```
minitodo/
├── app/
│   ├── actions/           # Server Actions (auth, password reset)
│   ├── api/               # API route handlers (auth, tasks, tRPC)
│   ├── auth/              # Auth pages (error, forgot/reset password)
│   ├── dashboard/
│   │   ├── _components/   # Shared dashboard components (sidebar, nav)
│   │   ├── admin/         # Admin panel — user & task management
│   │   └── user/          # User dashboard — personal task board
│   ├── register/          # Registration page
│   ├── generated/         # Prisma generated client (gitignored)
│   ├── globals.css        # Global styles & Tailwind directives
│   ├── layout.tsx         # Root layout (fonts, providers, toaster)
│   └── page.tsx           # Landing / sign-in page
├── auth.ts                # NextAuth.js configuration
├── components/
│   ├── ui/                # Shadcn/ui primitives (button, card, table, etc.)
│   ├── login-form.tsx     # Login form component
│   ├── register-form.tsx  # Registration form component
│   ├── TaskItem.tsx       # Individual task row component
│   └── List.tsx           # Task list wrapper
├── hooks/                 # Custom React hooks
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── mail.ts            # Email utility (Nodemailer)
│   ├── zod.ts             # Shared Zod validation schemas
│   └── utils.ts           # General utilities (cn, etc.)
├── provider/
│   └── TRPCProvider.tsx   # tRPC + React Query provider
├── server/
│   ├── routers/           # tRPC routers (task, admin)
│   ├── context.ts         # tRPC context (session injection)
│   ├── trpc.ts            # tRPC initialization & middleware
│   └── index.ts           # Root router export
├── types/                 # TypeScript type declarations
├── utils/                 # Utility helpers (hashing, tRPC client)
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration history
├── public/                # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Authentication

Authentication is powered by **NextAuth.js v5** with the Prisma adapter. Two providers are configured:

| Provider        | Details                                      |
| --------------- | -------------------------------------------- |
| **Credentials** | Email + password sign-in with bcrypt hashing |
| **Google**      | OAuth 2.0 — requires verified email          |

Sessions use the **JWT strategy**. User roles (`USER`, `MANAGER`, `ADMIN`) are embedded in the token and exposed via the session object for client-side access control.

### Auth Flows

- **Sign In** — `/` (landing page with login form)
- **Register** — `/register`
- **Forgot Password** — `/auth/forgot-password` → sends reset email
- **Reset Password** — `/auth/reset-password?token=...`
- **Auth Error** — `/auth/error`

---

## API Layer (tRPC)

The API is built with **tRPC v11** and exposed via a single Next.js API route at `/api/trpc/[trpc]`.

### Routers

| Router  | Responsibility                         |
| ------- | -------------------------------------- |
| `task`  | CRUD operations on tasks (user-scoped) |
| `admin` | User and task management (admin-only)  |

All inputs are validated with **Zod** schemas, and the tRPC context injects the authenticated session for authorization checks.

### Client Usage

```tsx
import { trpc } from "@/utils/trpc";

// Inside a React component
const { data: tasks } = trpc.task.getAll.useQuery();
const createTask = trpc.task.create.useMutation();
```

---

## Deployment

This project is optimized for **Vercel** deployment.

### Deploy to Vercel

1. Push your repository to GitHub (or GitLab / Bitbucket).
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Configure the required [environment variables](#environment-variables) in the Vercel project settings.
4. Vercel automatically detects the Next.js framework and applies the optimal build configuration.
5. Every push to `main` triggers a production deployment; pull requests get preview deployments.

### Prisma on Vercel

Prisma Client is generated during the build step. Ensure the `postinstall` script or the build command includes `prisma generate` if needed. The generated client is output to `app/generated/prisma/` and is gitignored.

### Important Vercel Notes

- The **Build Command** defaults to `next build` — no changes required.
- Set `DATABASE_URL` to a connection-pooler URL (e.g., Neon pooler, Supabase pooler) for optimal serverless performance.
- Set `AUTH_SECRET` and `AUTH_URL` (use your production domain for `AUTH_URL`).

---

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint across the project        |

---

## Contributing

Contributions are welcome! To get started:

1. **Fork** the repository.
2. **Create a feature branch:** `git checkout -b feature/my-feature`
3. **Commit your changes:** `git commit -m "feat: add my feature"`
4. **Push to the branch:** `git push origin feature/my-feature`
5. **Open a Pull Request** against `main`.

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## Use It Yourself

MiniTodo is **open source** and designed to be easily self-hosted. You can spin up your own instance by connecting any PostgreSQL database — no vendor lock-in.

### Quick Start (Personal Use)

1. **Fork & clone** the repository:

   ```bash
   git clone https://github.com/<your-username>/minitodo.git
   cd minitodo
   npm install
   ```

2. **Provision a PostgreSQL database** — use any provider you prefer:
   - [Neon](https://neon.tech) (free tier available)
   - [Supabase](https://supabase.com) (free tier available)
   - [Railway](https://railway.app)
   - [ElephantSQL](https://www.elephantsql.com)
   - Or a local PostgreSQL instance

3. **Create your `.env`** file (see [Environment Variables](#environment-variables)) and set `DATABASE_URL` to your database connection string.

4. **Run migrations & generate the Prisma client:**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the app:**

   ```bash
   npm run dev
   ```

6. **Deploy to Vercel** (optional) — import the forked repo and add your environment variables in the Vercel dashboard. That's it — you'll have your own production instance.

> **Tip:** For serverless environments like Vercel, use a **connection-pooler URL** (e.g., Neon pooler, Supabase pooler) as your `DATABASE_URL` to avoid exhausting database connections.

---

## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this project for personal or commercial purposes. See the `LICENSE` file for full details.
