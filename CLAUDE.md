# CLAUDE.md — FitKot

## Project Overview

FitKot is a web-based fitness tracking app for Flemish students who train in small spaces ("kot" = student room) without equipment. Monthly subscription: €5/month. Three user roles: User, Trainer, Admin.

**Target users:**
- Studerende Stan (21, student, slow WiFi, budget-conscious)
- Sofia Martens (28, freelance personal trainer, data-driven)
- Admin (developer/platform operator)

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Storage:** AWS S3 (progress photos — signed URLs, max 5MB, JPEG/PNG only)
- **Hosting:** Railway
- **CI/CD:** GitHub Actions (auto-test + deploy on merge to `main`)
- **Email/2FA:** Resend
- **Error monitoring:** Sentry
- **Payments:** Stripe (conditional — future phase)

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm test` — Run test suite
- `npm run lint` — ESLint check
- `npx supabase start` — Local Supabase instance
- `npx supabase db push` — Push migrations to remote
- `npx supabase gen types typescript --local > src/types/database.ts` — Generate DB types

## Architecture — 7 Modules

| Module | Responsibility | Primary Role(s) |
|--------|---------------|-----------------|
| M1 Auth | OAuth login (Google/GitHub), 2FA, session mgmt, RBAC | All |
| M2 Workout Mgmt | Log workouts, view history, analytics | User |
| M3 Progress | Photos, notes, streaks, stats | User |
| M4 Nutrition | Diet plans, meal logging, diet suggestions | User, Trainer |
| M5 Trainer Tools | Create/edit plans, monitor clients, live feed | Trainer |
| M6 Admin Panel | User mgmt, role mgmt, platform stats | Admin |
| M7 Infrastructure | DB schema, API layer, S3, CI/CD, Sentry | Developer |

## Database Tables

- `users` — id, email, name, role (user/trainer/admin), status, oauth_provider
- `workout_plans` — id, title, description, exercises (jsonb), trainer_id, version
- `plan_assignments` — id, plan_id, user_id, assigned_at
- `workout_logs` — id, user_id, plan_id (nullable), exercises (jsonb), duration, date, notes
- `progress_photos` — id, user_id, s3_url, uploaded_at
- `notes` — id, user_id, workout_log_id, text, created_at
- `diet_plans` — id, trainer_id, user_id, meals (jsonb), calories_target, created_at
- `meal_logs` — id, user_id, diet_plan_id, food_items (jsonb), calories, protein, carbs, fat, date

All tables use Row-Level Security (RLS). Users see only their own data. Trainers see only assigned clients.

## Conventions

### Code
- TypeScript strict mode — no `any` types
- Server Components by default; `"use client"` only when needed
- Database access only through Supabase client in server components/actions
- API routes in `src/app/api/`
- All API endpoints validate user role server-side before processing
- Commit messages: imperative mood, < 72 chars

### Auth & Security
- JWT stored in httpOnly cookies — NEVER localStorage
- OAuth via Supabase Auth (Google, GitHub)
- 2FA via Resend email codes — required for trainer plan edits
- Session expiry: 24h inactivity (SEC-1.3)
- Account lockout: 5 failed attempts → 15min lock (SEC-1.5)
- CORS: only allow FitKot frontend domain
- Rate limiting: 100 req/min per user
- S3 signed URLs expire after 1 hour
- All user input validated + sanitized client & server side
- Parameterized queries only (Supabase handles this)

### UI/UX
- Dutch UI labels, English code
- Brand colors: Deep Teal #1C5F78, Electric Teal #2A7F9E, Warm Lime #B8D944, Coral #E8614A, Off-White #F4F3EF
- Typography: Barlow Condensed (display), Barlow Semi Condensed (headings), DM Sans (body), DM Mono (labels)
- Icons: Lucide React
- 8px spacing grid (4, 8, 12, 16, 24, 32, 48, 64)
- Min tap target: 44x44px
- Responsive: 4-col mobile, 8-col tablet, 12-col desktop
- Skeleton loading states — no spinners
- Respect prefers-reduced-motion
- WCAG AA contrast (4.5:1 body, 3:1 large text)

### File uploads
- JPEG/PNG only, max 5MB
- Upload to S3 via presigned URLs
- Store S3 URL in `progress_photos` table
- Show upload progress indicator within 200ms

## Performance Targets
- FCP < 1.5s, LCP < 2.5s, TTI < 3.5s, CLS < 0.1
- Page weight < 500KB initial load
- API responses < 500ms for 95th percentile
- Photo upload < 5s on broadband
- Trainer real-time feed < 2s latency

## Project Structure

```
fitkot/
├── CLAUDE.md
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (user)/
│   │   │   ├── dashboard/
│   │   │   ├── workouts/
│   │   │   ├── progress/
│   │   │   └── nutrition/
│   │   ├── (trainer)/
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   └── plans/
│   │   ├── (admin)/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   └── stats/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/           # Shared UI components
│   │   ├── workout/      # Workout-specific components
│   │   ├── trainer/      # Trainer-specific components
│   │   └── admin/        # Admin-specific components
│   ├── lib/
│   │   ├── supabase/     # Supabase client + helpers
│   │   ├── s3/           # S3 upload helpers
│   │   └── utils/        # Shared utilities
│   └── types/
│       └── database.ts   # Auto-generated Supabase types
├── supabase/
│   ├── migrations/       # SQL migration files
│   └── seed.sql          # Test/dev seed data
├── public/
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI/CD
└── package.json
```

## Team

| Member | Modules | Focus |
|--------|---------|-------|
| Mats | M1 + M7 | Auth + Infrastructure |
| Thomas | M2 + M3 | Workout + Progress (user-facing) |
| Stan | M4 + M5 + M6 | Nutrition + Trainer + Admin |

## Key Requirements (quick ref)

- FR-1: OAuth login (Google/GitHub)
- FR-2: 2FA for trainer plan edits
- FR-3: Role assignment on registration (default: user)
- FR-4: Session invalidation on logout / 24h inactivity
- FR-9: Users log workouts (exercises, sets, reps, duration)
- FR-14: Photo upload (max 5MB → S3)
- FR-15: Trainers see live client feed (Supabase Realtime)
- FR-23: Admin CRUD on user accounts
- NFR-1: API < 500ms (95th percentile, ≤ 1000 users)
- NFR-8: Responsive 360px–1920px
