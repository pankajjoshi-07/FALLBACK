# Requirements Matrix: Arcane Codex — Life RPG

This document maps all mandatory competition requirements and high-value enhancements against implementation and verification status.

## Non-Negotiable Core Requirements

| ID | Category | Requirement | Specification | Status | Evidence / Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-A1** | Auth | User Registration | Secure signup with validated email, display name, password (bcrypt cost 12, <=72 bytes) | **VERIFIED** | `src/app/api/auth/register/route.ts` |
| **REQ-A2** | Auth | Session Management | Server-issued HttpOnly, SameSite cookies; secure session verification | **VERIFIED** | `src/server/auth/session.ts` |
| **REQ-A3** | Security | Authorization & Isolation | Every private endpoint enforces user ID derived solely from verified session | **VERIFIED** | Scoped queries in all 15 API routes |
| **REQ-B1** | Persistence | PostgreSQL Source of Truth | Character, quests, logs, gold ledger, inventory persist in PostgreSQL via Prisma | **VERIFIED** | `prisma/schema.prisma` |
| **REQ-B2** | Persistence | Cross-Device Persistence | Re-login from fresh browser/device restores identical state; no localStorage source of truth | **VERIFIED** | Database backing all state models |
| **REQ-C1** | Quests | Full Quest CRUD | Create, read, update, delete (soft archive) with validation and loading states | **VERIFIED** | `src/app/api/quests/route.ts` & `[id]/route.ts` |
| **REQ-C2** | Quests | Reward-Affecting Edit Lock | Prevent difficulty/cadence/attribute tampering after first rewarded completion | **VERIFIED** | Enforced in `PATCH /api/quests/:id` |
| **REQ-D1** | Progression | Non-Linear Level Curve | $xpRequired(L) = 100 + 50n + 25n^2$ where $n = L - 1$ | **VERIFIED** | Tests pass in `tests/unit/progression.test.ts` |
| **REQ-D2** | Progression | Multi-Level Ups & Level Cap | Handle exact thresholds, multiple level-ups from single reward, level cap 100 ("MAX") | **VERIFIED** | Tests pass in `tests/unit/progression.test.ts` |
| **REQ-E1** | Streaks | Consecutive Day Activity | Increment on consecutive day, unchanged on same day, reset to 1 on missed day | **VERIFIED** | Tests pass in `tests/unit/streaks.test.ts` |
| **REQ-E2** | Streaks | Timezone-Aware Calculation | Local calendar days evaluated using user's stored IANA activity timezone | **VERIFIED** | Tests pass in `tests/unit/streaks.test.ts` |
| **REQ-E3** | Streaks | Multiplier Bps | Multiplier bps = $10000 + 200 \times \min(\max(streak - 1, 0), 25)$ (up to 50% bonus) | **VERIFIED** | Tests pass in `tests/unit/streaks.test.ts` |
| **REQ-F1** | Attributes | 5 Core Attributes | Strength, Intellect, Discipline, Vitality, Charisma | **VERIFIED** | `Character` schema & UI radar cards |
| **REQ-F2** | Attributes | Attribute Progression Math | $\text{attributeLevel} = 1 + \lfloor\sqrt{\text{attributeXp} / 100}\rfloor$ | **VERIFIED** | Tests pass in `tests/unit/progression.test.ts` |
| **REQ-G1** | Economy | Virtual Currency (Gold) | Gold awarded = $\lfloor xpAwarded \times 60 / 100 \rfloor$, tracked via immutable `GoldLedger` | **VERIFIED** | Tests pass in `tests/unit/economy.test.ts` |
| **REQ-G2** | Economy | Usable Cosmetic Catalog | Titles, avatars, themes (Crimson, Emerald), frames, badges | **VERIFIED** | Tested in `tests/unit/economy.test.ts` |
| **REQ-G3** | Economy | Live Theme Switching | Equipping theme immediately switches UI theme via CSS variables and persists | **VERIFIED** | `Marketplace.tsx` & `globals.css` |
| **REQ-H1** | UI / A11y | Responsive Design | Fluid layout from mobile 320px to desktop with bottom nav & touch targets | **VERIFIED** | Mobile bottom nav & responsive grids |
| **REQ-H2** | UI / A11y | Keyboard & Screen Reader | Full keyboard focus rings, skip-to-content, ARIA live announcements, polite regions | **VERIFIED** | Focus rings & ARIA live announcer |
| **REQ-H3** | UI / A11y | Reduced Motion Support | Respects `prefers-reduced-motion` with instant transitions when enabled | **VERIFIED** | Configured in `globals.css` |
| **REQ-T1** | Transaction | Atomic Completion Engine | Idempotency key, transaction lock, period key check, receipt storage | **VERIFIED** | `src/server/services/completion-service.ts` |

---

## High-Value Gamification Enhancements

| Feature | Description | Status | Verification |
| :--- | :--- | :--- | :--- |
| **52 Quest Templates** | Pre-built editable templates across all 5 attributes | **VERIFIED** | Tests pass in `tests/unit/templates.test.ts` |
| **Personal Weekly Boss** | "Procrastinus, Keeper of Delay" transactional damage | **VERIFIED** | `BossCard.tsx` & `/api/boss` |
| **Activity Heatmap** | 12-week visual GitHub-style contribution grid of quest activity | **VERIFIED** | `Chronicle.tsx` & `/api/activity` |
| **Character Sheet Attributes** | Visual attributes with accessible text table | **VERIFIED** | `CharacterSheet.tsx` |
| **Procedural Sound Engine** | Web Audio API chimes & fanfare, opt-in, default off | **VERIFIED** | `src/lib/audio.ts` |
| **Achievement Badges** | First quest, 10 quests, 7-day streak, Level 5, etc. | **VERIFIED** | `achievements.ts` |
