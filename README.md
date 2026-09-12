# Arcane Codex — Life RPG
> **“Turn your real-life progress into a legend.”**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3_Strict-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7_App_Router-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3_PostgreSQL-indigo)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-cyan)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0.5-orange)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ⚔️ Project Overview

Traditional habit and to-do apps often feel like tedious chores because the psychological reward for studying, exercising, reading, and self-care is delayed.

**Arcane Codex — Life RPG** bridges this gap by connecting real-world effort to immediate, server-verified character progression. Built with a dark fantasy adventure journal aesthetic, it transforms personal discipline into heroic ascension without shame-driven mechanics, guilt-tripping health drops, or fragile client-side prototypes.

---

## ✨ Non-Negotiable Core Features Implemented

1. **True PostgreSQL Persistence via Prisma ORM**:
   - Quests, character stats, gold balances, inventory, achievements, and activity logs survive hard refreshes and cross-device sign-ins.
   - Zero reliance on `localStorage` as a primary database.
2. **Authoritative Transactional Completion Engine**:
   - `POST /api/quests/:id/complete` enforces server-side calculation of all rewards.
   - Replay protection via `Idempotency-Key` headers and `MutationReceipt` cryptographic hashes.
   - Atomic double-entry `GoldLedger` preventing double-spend exploits.
3. **Non-Linear Leveling Curve & Multi-Level Ups**:
   - Level progression governed by $xpRequiredToAdvance(L) = 100 + 50n + 25n^2$ where $n = L - 1$.
   - Supports exact threshold crossings, single-reward multi-level jumps, and a clean Level 100 ("MAX") cap.
4. **Timezone-Aware Recurrence & Grace-Over-Shame Streaks**:
   - Local calendar day arithmetic anchored in the user's locked IANA activity timezone.
   - Recurrence checked via deterministic period keys (`ONCE`, `DAY:YYYY-MM-DD`, `WEEK:YYYY-MM-DD`).
   - Inactive days reset streaks gracefully without draining gold, taking away levels, or punishing health.
5. **5 Core Attributes with Square-Root Growth**:
   - **Strength** (Physical), **Intellect** (Learning/Coding), **Discipline** (Focus/Routines), **Vitality** (Recovery/Mindfulness), **Charisma** (Connection).
   - $\text{attributeLevel} = 1 + \lfloor\sqrt{\text{attributeXp} / 100}\rfloor$.
6. **Merchant Bazaar & Dynamic Live Theming**:
   - Earn gold through deeds and acquire permanent cosmetic relics (Themes, Avatars, Titles, Frames).
   - Equipping **Crimson Covenant** or **Emerald Grove** immediately alters the entire web interface via root CSS variables and persists to the database.
7. **Personal Weekly Boss ("Procrastinus, Keeper of Delay")**:
   - Inflict base XP damage through completed quests to vanquish the Keeper of Delay before Sunday midnight.
8. **Chronicle & Activity Heatmap**:
   - 12-week visual GitHub-style contribution grid visualizing daily consistency.
   - Paginated, immutable audit trail of past completions.
9. **Template Codex (52 Curated Quests)**:
   - Comprehensive starter templates distributed across all 5 attributes.
10. **Procedural Sound Synthesizer & Accessibility**:
    - Procedural Web Audio API chime and fanfare; zero external audio binary downloads.
    - Full keyboard navigation, visible focus indicators, skip-to-content links, polite ARIA live announcements, and `prefers-reduced-motion` compliance.

---

## 🏛️ Technology Stack & Actual Versions

| Component | Technology | Version | Location |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Node.js runtime) | `15.1.7` | `src/app/` |
| **Language** | TypeScript (Strict Mode) | `5.7.3` | `tsconfig.json` |
| **Database ORM** | Prisma ORM | `6.19.3` | `prisma/schema.prisma`, `src/server/db/` |
| **Database** | PostgreSQL (Neon / Local Docker) | 16+ compatible | `DATABASE_URL` |
| **Styling** | Tailwind CSS | `3.4.17` | `tailwind.config.ts`, `src/app/globals.css` |
| **State Management** | TanStack Query (React Query) | `5.66.9` | `src/components/providers/` |
| **Animations** | Motion for React (`framer-motion`) | `12.4.7` | `src/components/game/` |
| **Validation** | Zod | `3.24.2` | `src/server/` |
| **Testing** | Vitest | `3.0.5` | `tests/unit/` |
| **Icons** | Lucide React | `0.475.0` | `src/components/` |

---

## 📁 Repository Structure

```
├── docs/                           # Comprehensive engineering documentation
│   ├── ARCHITECTURE.md             # 9 Mermaid system & sequence diagrams
│   ├── GAME_DESIGN.md              # Progression math, curves, and formulas
│   ├── API.md                      # REST API endpoints and contracts
│   ├── SECURITY.md                 # Threat model, bcrypt 72-byte guard, sessions
│   ├── DEPLOYMENT.md               # Vercel & Neon release workflows
│   ├── TESTING.md                  # Test suite coverage breakdown
│   ├── COMPETITORS.md              # Research & verified differentiators
│   ├── ASSETS.md                   # Registry and license attribution
│   ├── DEMO_SCRIPT.md              # 150-second video demo walkthrough cues
│   ├── ROADMAP.md                  # Implemented vs future stretch backlog
│   ├── DECISIONS.md                # Architectural Decision Records (ADRs)
│   ├── REQUIREMENTS_MATRIX.md      # Requirement verification tracker
│   └── BUILD_STATUS.md             # Active build status and test records
├── prisma/
│   ├── schema.prisma               # PostgreSQL models, constraints, indexes
│   └── seed.ts                     # Reference data seeder (52 templates, shop, achievements)
├── src/
│   ├── app/
│   │   ├── (auth)/login & register # Authenticated account onboarding
│   │   ├── (game)/dashboard        # Unified dashboard with sticky HUD
│   │   ├── api/                    # 15 typed Next.js Route Handlers
│   │   ├── globals.css             # Dark fantasy tokens & dynamic theme CSS variables
│   │   ├── layout.tsx              # Root layout with accessibility skip links
│   │   └── page.tsx                # Public landing page with interactive simulator
│   ├── components/
│   │   ├── game/                   # Avatar, HUD, QuestCard, Modal, Bazaar, Boss
│   │   └── providers/              # TanStack Query & Theme ClientProviders
│   ├── lib/
│   │   ├── audio.ts                # Procedural Web Audio API sound synthesizer
│   │   └── utils.ts                # Tailwind clsx + twMerge utility
│   └── server/
│       ├── auth/session.ts         # Secure HttpOnly session & bcrypt cost 12
│       ├── db/prisma.ts            # Singleton Prisma client
│       ├── game/                   # Pure progression, streak, & economy logic
│       └── services/               # Transactional completion & purchase engines
└── tests/
    └── unit/                       # Vitest suites (progression, streaks, economy, templates)
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/arcane-codex-life-rpg.git
cd arcane-codex-life-rpg
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your PostgreSQL connection string:
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arcanecodex?schema=public"
AUTH_SECRET="your-development-secret-key-at-least-32-chars-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to PostgreSQL or run migrations
npm run db:push

# Seed initial 52 templates, shop cosmetics, and achievements
npm run db:seed
```

### 4. Run Test Suite
```bash
npm test
```
*Runs all 38 automated unit tests verifying progression curves, streaks, and economics.*

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & Anti-Cheat Boundaries

1. **Authoritative Calculation**: Clients never send XP or currency quantities. The server computes all rewards transactionally.
2. **Bcrypt 72-Byte Truncation Guard**: Password inputs are strictly validated (`<= 72 UTF-8 bytes`) to prevent bcrypt's silent truncation vulnerability.
3. **HttpOnly Cookie Sessions**: Session tokens are stored in cryptographically signed `HttpOnly`, `SameSite=Lax`, `Secure` cookies. Zero auth tokens in `localStorage`.
4. **Timezone Locking**: The user's activity timezone is permanently locked after their first rewarded quest to eliminate timezone-hopping daily exploits.
5. **Honesty Boundary**: The system cryptographically guarantees reward limits, stat integrity, and financial ledgers; it does not claim to physically verify whether offline exercise or reading occurred.

---

## 📜 Asset & Open Source Attribution

- **Icons**: [Lucide Icons](https://lucide.dev/) under ISC License.
- **Typography**: [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Sora](https://fonts.google.com/specimen/Sora) via Google Fonts under SIL Open Font License 1.1.
- **Audio**: Procedurally generated via browser Web Audio API oscillator synthesis; zero external binary audio assets.
- **Avatars & Emblems**: Original SVG designs created specifically for Arcane Codex.
