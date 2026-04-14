# Loida British Hub

Central platform connecting Harmony, Career for Everyone, and The Business Clock.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment
```bash
cp .env.example .env
```
Fill in your values:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console (optional)

### 3. Database
```bash
# Push schema to your database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts (after seed)

| Role  | Email                        | Password       |
|-------|------------------------------|----------------|
| Admin | admin@loidabritish.com       | admin123456    |
| User  | demo@loidabritish.com        | demo123456     |

---

## Project Structure

```
loida-hub/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── layout.tsx                ← Root layout
│   ├── globals.css               ← Design tokens
│   ├── auth/
│   │   ├── login/page.tsx        ← Sign in
│   │   └── signup/page.tsx       ← Register (with domain selection)
│   ├── dashboard/
│   │   ├── page.tsx              ← Overview with stats
│   │   ├── assessments/          ← Take assessments
│   │   ├── programs/             ← Browse & enroll
│   │   ├── sessions/             ← Bookings
│   │   ├── coaches/              ← Find coaches
│   │   ├── membership/           ← Upgrade plan
│   │   └── profile/              ← Edit profile
│   └── api/
│       ├── auth/                 ← NextAuth + register
│       ├── programs/             ← CRUD + enroll
│       ├── assessments/          ← Submit results
│       ├── bookings/             ← Book sessions
│       └── profile/              ← Update profile
├── components/
│   ├── landing/                  ← All landing page sections
│   └── dashboard/                ← Sidebar, Topbar, forms
├── lib/
│   ├── auth.ts                   ← NextAuth config
│   ├── prisma.ts                 ← DB client singleton
│   └── utils.ts                  ← Helpers
├── prisma/
│   ├── schema.prisma             ← Full data model
│   └── seed.ts                   ← Demo data
├── types/
│   └── index.ts                  ← TypeScript types + domain config
├── middleware.ts                  ← Route protection
└── .env.example
```

---

## Key Architecture Decisions

- **App Router** — server components for all data fetching, client only for interactivity
- **Prisma** — full type-safety, easy migrations, PostgreSQL
- **NextAuth v5** — credentials + Google OAuth, JWT sessions, role-based
- **Role system** — `USER`, `COACH`, `ADMIN` via JWT token
- **Membership gating** — API routes check plan before allowing enrollment/booking
- **Domain system** — `HARMONY`, `CAREER`, `BUSINESS` across all models

---

## Adding a New Platform Page

1. Create `app/dashboard/your-page/page.tsx`
2. Add to `navItems` in `components/dashboard/Sidebar.tsx`
3. Add breadcrumb in `components/dashboard/Topbar.tsx`
4. Add API routes in `app/api/your-resource/route.ts`

---

## Connecting to Sub-Platforms

Each sub-platform (Harmony, Career, Business Clock) should:
1. Accept `?source=loida&userId=xxx` query param on entry
2. Call `https://hub.loidabritish.com/api/profile` with the auth token
3. Sync progress back via API webhooks or shared Prisma DB

---

Built with Next.js 14 · TypeScript · Tailwind CSS · Prisma · NextAuth
