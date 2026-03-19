# Release: v0.1.0-prototype — FitKot Prototype Test Release

**Tag:** `v0.1.0-prototype`
**Branch:** `claude/review-issue-and-files-xSbJJ`
**Type:** Pre-release (Prototype)
**Date:** 2026-03-19

---

## Summary

Initial scaffold of the **FitKot** fitness tracking app for Flemish students who train in small spaces ("kot" = student room) without equipment.

## What's Included

### Tech Stack
- Next.js 16 (App Router) + TypeScript strict mode
- Tailwind CSS v4 with FitKot brand design system
- Supabase (PostgreSQL + Auth + Realtime) integration
- AWS S3 progress photo upload (presigned URLs)
- GitHub Actions CI/CD pipeline

### Modules Implemented

| Module | Description | Status |
|--------|-------------|--------|
| M1 Auth | OAuth login (Google/GitHub), session middleware, route protection | Done |
| M2 Workouts | Workout logging, exercise tracking, plan viewing, history | Done |
| M3 Progress | Photo uploads (S3, max 5MB, JPEG/PNG), photo gallery, notes | Done |
| M4 Nutrition | Diet plans, meal logging, macro tracking (kcal/P/K/V) | Done |
| M5 Trainer Tools | Client management, plan creation, activity live feed | Done |
| M6 Admin Panel | User CRUD, role management, trainer-client assignments, stats | Done |
| M7 Infrastructure | DB schema (11 tables, RLS), S3 helpers, CI/CD | Done |

### Routes (20 total)

**Static:** `/`, `/login`, `/register`
**User:** `/dashboard`, `/workouts`, `/workouts/new`, `/progress`, `/nutrition`
**Trainer:** `/trainer-dashboard`, `/clients`, `/plans`, `/plans/new`
**Admin:** `/admin-users`, `/admin-roles`, `/admin-stats`
**API:** `/api/auth/callback`, `/api/upload`, `/api/photos`

### UI Components
- Button, Input, Card, Skeleton, Nav, AppShell
- FitKot brand colors (Deep Teal, Electric Teal, Warm Lime, Coral, Off-White)
- Dutch (NL) interface labels
- 44px minimum tap targets, responsive 360px–1920px
- Skeleton loading states, prefers-reduced-motion support

### Database Schema
- 11 tables with Row-Level Security (RLS)
- 3 custom enums (user_role, user_status, workout_unit)
- 11 indexes for query performance
- 3 updated_at triggers
- Realtime enabled on workout_logs (trainer live feed)
- Helper functions: `get_user_role()`, `is_trainer_of()`

## Setup Instructions

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase + AWS credentials

# Start local Supabase
npx supabase start

# Apply database migration
npx supabase db push

# Generate TypeScript types (optional, manual types included)
npx supabase gen types typescript --local > src/types/database.ts

# Start dev server
npm run dev
```

## Creating the GitHub Release

To publish this release on GitHub, run:

```bash
# Tag is already created locally
git push origin v0.1.0-prototype

# Or create release via GitHub CLI
gh release create v0.1.0-prototype \
  --target claude/review-issue-and-files-xSbJJ \
  --title "v0.1.0-prototype — FitKot Prototype Test Release" \
  --notes-file RELEASE_NOTES.md \
  --prerelease
```

## Known Limitations (Prototype)
- S3 presigned URL generation requires AWS SDK setup (placeholder in place)
- 2FA via Resend not yet wired (table and structure ready)
- Sentry error monitoring not yet integrated
- Stripe payments deferred to future phase
- No automated tests yet (test script placeholder configured)
