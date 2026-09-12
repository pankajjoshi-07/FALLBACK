# Requirements Matrix: Arcane Codex — Life RPG

This document maps all mandatory competition requirements and high-value enhancements against implementation and verification status.

## Non-Negotiable Core Requirements

| ID | Category | Requirement | Specification | Status | Evidence / Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-A1** | Auth | User Registration | Secure signup with validated email, display name, password (bcrypt cost 12, <=72 bytes) | IN PROGRESS | `src/app/api/auth/register/route.ts` |
| **REQ-A2** | Auth | Session Management | Server-issued HttpOnly, SameSite cookies; secure session verification | IN PROGRESS | `src/server/auth/session.ts` |
| **REQ-A3** | Security | Authorization & Isolation | Every private endpoint enforces user ID derived solely from verified session | IN PROGRESS | Scoped database queries |
| **REQ-B1** | Persistence | PostgreSQL Source of Truth | Character, quests, logs, gold ledger, inventory persist in PostgreSQL via Prisma | IN PROGRESS | `prisma/schema.prisma` |
| **REQ-B2** | Persistence | Cross-Device Persistence | Re-login from fresh browser/device restores identical state; no localStorage source of truth | IN PROGRESS | PostgreSQL backing all states |
| **REQ-C1** | Quests | Full Quest CRUD | Create, read, update, delete (soft archive) with validation and loading states | IN PROGRESS | `src/app/api/quests` |
| **REQ-C2** | Quests | Reward-Affecting Edit Lock | Prevent difficulty/cadence/attribute tampering after first rewarded completion | IN PROGRESS | Business rule checks in PATCH |
| **REQ-D1** | Progression | Non-Linear Level Curve | $xpRequired(L) = 100 + 50n + 25n^2$ where $n = L - 1$ | IN PROGRESS | `src/server/game/progression.ts` |
| **REQ-D2** | Progression | Multi-Level Ups & Level Cap | Handle exact thresholds, multiple level-ups from single reward, level cap 100 ("MAX") | IN PROGRESS | Unit tests in `tests/unit/progression.test.ts` |
| **REQ-E1** | Streaks | Consecutive Day Activity | Increment on consecutive day, unchanged on same day, reset to 1 on missed day | IN PROGRESS | `src/server/game/streaks.ts` |
| **REQ-E2** | Streaks | Timezone-Aware Calculation | Local calendar days evaluated using user's stored IANA activity timezone | IN PROGRESS | Tested across month/DST shifts |
| **REQ-E3** | Streaks | Multiplier Bps | Multiplier bps = $10000 + 200 \times \min(\max(streak - 1, 0), 25)$ (up to 50% bonus) | IN PROGRESS | Pure progression unit tests |
| **REQ-F1** | Attributes | 5 Core Attributes | Strength, Intellect, Discipline, Vitality, Charisma | IN PROGRESS | Character schema & logs |
| **REQ-F2** | Attributes | Attribute Progression Math | $\text{attributeLevel} = 1 + \lfloor\sqrt{\text{attributeXp} / 100}\rfloor$ | IN PROGRESS | Unit tests in `tests/unit/attributes.test.ts` |
| **REQ-G1** | Economy | Virtual Currency (Gold) | Gold awarded = $\lfloor xpAwarded \times 60 / 100 \rfloor$, tracked via immutable `GoldLedger` | IN PROGRESS | `src/server/game/economy.ts` |
| **REQ-G2** | Economy | Usable Cosmetic Catalog | Titles, avatars, themes (Crimson, Emerald), frames, badges | IN PROGRESS | `prisma/seed.ts` |
| **REQ-G3** | Economy | Live Theme Switching | Equipping theme immediately switches UI theme via CSS variables and persists | IN PROGRESS | Dynamic theme provider |
| **REQ-H1** | UI / A11y | Responsive Design | Fluid layout from mobile 320px to desktop with bottom nav & touch targets | IN PROGRESS | Mobile-first Tailwind |
| **REQ-H2** | UI / A11y | Keyboard & Screen Reader | Full keyboard focus rings, skip-to-content, ARIA live announcements, polite regions | IN PROGRESS | Accessible components |
| **REQ-H3** | UI / A11y | Reduced Motion Support | Respects `prefers-reduced-motion` with instant transitions when enabled | IN PROGRESS | Motion provider & CSS media |
| **REQ-T1** | Transaction | Atomic Completion Engine | Idempotency key, transaction lock, period key check, receipt storage | IN PROGRESS | `src/server/services/completion-service.ts` |

---

## High-Value Gamification Enhancements

| Feature | Description | Status |
| :--- | :--- | :--- |
| **50+ Quest Templates** | Pre-built editable templates across all 5 attributes | IN PROGRESS (`prisma/seed.ts`) |
| **Personal Weekly Boss** | "Procrastinus, Keeper of Delay" transactional damage | PLANNED |
| **Activity Heatmap** | GitHub-style calendar grid of quest activity | PLANNED |
| **Radar Chart / Attribute Pentagon** | Visual attributes with accessible text table | PLANNED |
| **Sound Synthesis Engine** | Web Audio API chimes/fanfares, default off | PLANNED |
| **Achievement Badges** | First quest, 10 quests, 7-day streak, Level 5, etc. | PLANNED |
