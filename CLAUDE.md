# Financial Pro Launchpad

## Project Overview
Financial services launchpad application for financial professionals. Agents register, get a referral code, and can run Balance Sheet analyses for personal and business prospects. Includes referral tracking, notifications, and email alerts.

## Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Database:** PostgreSQL on Railway + Prisma 6.19
- **Styling:** Tailwind CSS 4
- **Auth:** iron-session + bcryptjs
- **Email:** Resend
- **Validation:** Zod 4
- **Icons:** Lucide React

## App Structure
```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── error.tsx                   # Error boundary
├── not-found.tsx               # Custom 404
├── (auth)/                     # Auth route group
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (dashboard)/                # Protected dashboard
│   └── dashboard/
│       ├── page.tsx
│       ├── balance-sheet/
│       ├── notifications/
│       └── prospects/
├── b/[agentCode]/              # Public balance sheet (agent referral link)
├── sme/                        # SME user pages
│   ├── forgot-password/
│   └── reset-password/
└── api/
    ├── auth/                   # Agent auth (login, register, logout, forgot/reset password)
    ├── sme/auth/               # SME auth (login, forgot/reset password)
    ├── balance-sheet/save/     # Save balance sheet analysis
    ├── leads/                  # Lead capture
    └── public/lead/            # Public lead submission
```

## Build Script
The build script includes `prisma generate`:
```bash
"build": "prisma generate && next build"
```

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production (includes prisma generate)
npm run lint         # Run linting
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to dev database
npm run db:migrate   # Create migration (production)
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio GUI
```

## Environment Variables
See `.env.example` for all required variables:
- `DATABASE_URL` - Railway PostgreSQL connection string (must include `?sslmode=require`)
- `SESSION_SECRET` - Session encryption key (required in production, generate with `openssl rand -base64 32`)
- `RESEND_API_KEY` - Resend email API key
- `RESEND_FROM_EMAIL` - Sender email address
- `NEXT_PUBLIC_BASE_URL` - App base URL for email links

## Auth Architecture
- **Agent auth:** iron-session with `AGENT` role
- **SME auth:** iron-session with `ADMIN` role
- **Middleware:** `middleware.ts` protects `/dashboard/*` and select API routes
- **Rate limiting:** In-memory rate limiter on all auth endpoints (5 attempts/15 min)
- **Audit logging:** Auth + security events logged to stdout

## Key Patterns
- **Password reset:** Token-based with 1-hour expiry, email via Resend
- **Referral codes:** Crypto-random with uniqueness retry loop
- **Placeholder emails:** Uses `.invalid` TLD (RFC 2606) for prospects without real emails
- **Cascade deletes:** FinancialProfile and BusinessFinancialProfile cascade on Prospect delete
- **Balance sheet referrals:** SetNull on prospect delete (referrals survive)

## Deployment
- **Hosting:** Vercel (auto-deploy from main)
- **Database:** Railway PostgreSQL

## Current Status
Active development. Phase 1 critical fixes complete. Phase 2 (balance sheet, referrals, protection analysis) complete.
