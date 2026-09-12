# Product Roadmap & Feature Status: Arcane Codex

This document provides a transparent, honest accounting of what is fully implemented and tested versus what is slated for future development phases.

---

## 1. Implemented & Verified in v1.0.0

| Feature | Subsystem | Verification |
| :--- | :--- | :--- |
| **Authentication & Sessions** | Security | Custom registration, bcrypt cost 12 with 72-byte guard, HttpOnly session cookies |
| **PostgreSQL Persistence** | Database | Complete Prisma schema with relations, cascading soft archives, double-entry gold ledger |
| **Transactional Completion Engine** | Game Core | Atomic execution with Idempotency-Key, MutationReceipt, and period keys |
| **Non-Linear Leveling Curve** | Game Core | $100 + 50n + 25n^2$, exact boundary transitions, multi-level jumps, Level 100 cap |
| **Timezone-Aware Streaks** | Game Core | Calendar date arithmetic, DST/month boundary handling, locked activity timezone, basis point multipliers |
| **5 Attribute Progression** | Game Core | Strength, Intellect, Discipline, Vitality, Charisma with square-root level progression |
| **Quest Board & Management** | UX | Full CRUD, cadence filters (Daily, Weekly, Once), search bar, and reward edit lock |
| **Template Codex** | Content | 52 comprehensive, curated reference templates across all 5 attributes |
| **Merchant Bazaar & Inventory** | Economy | Usable cosmetic relics, level requirements, double-spend prevention |
| **Live CSS Dynamic Theming** | Design System | Live switching between Midnight Codex, Crimson Covenant, and Emerald Grove |
| **Personal Weekly Boss** | Gamification | "Procrastinus, Keeper of Delay" sustained with base XP damage, zero negative punishment |
| **Activity Heatmap & Chronicle** | Analytics | 12-week visual GitHub-style contribution grid and paginated historical audit trail |
| **Procedural Sound Synthesizer** | Audio | Web Audio API procedural chime and fanfare; zero external audio asset dependencies |
| **Accessibility & Motion** | A11y | Visible focus rings, polite ARIA live regions, skip-to-content link, `prefers-reduced-motion` |

---

## 2. Stretch Features Backlog (Roadmap)

The following systems are documented design concepts for future iterations. They are not active in v1.0 to ensure 100% stability of core requirements:

### A. Focus Session Timer (Pomodoro Mode)
- **Concept**: Attaching an ambient focus timer to an active quest.
- **Backend Requirement**: Persisted server timestamps for elapsed time validation before granting focus bonuses; prevents browser reload or tab-freeze cheating.

### B. Directed Quest Chains
- **Concept**: Multi-step learning or project curriculum where completing step $N$ unlocks step $N+1$.
- **Backend Requirement**: Directed acyclic graph (DAG) dependency validation preventing circular dependencies.

### C. Streak Protection (Frost Ward)
- **Concept**: Consumable ward purchased with gold that preserves an active streak across a single missed calendar day.
- **Backend Requirement**: Transactional consumption recording without retroactive manipulation of `ActivityDay` history.

### D. Temporary XP Elixirs & Buffs
- **Concept**: Potions granting $+10\%$ bonus XP for a 2-hour window.
- **Backend Requirement**: Server-stored active buff expiration timestamps, strict caps on stacking multipliers.

### E. Compensating Undo Model (60-Second Grace Window)
- **Concept**: Option to cancel accidental quest completion within 60 seconds.
- **Backend Requirement**: Safe compensating event stream addressing spent currency, level reversals, boss damage rollback, and audit trail preservation.

### F. Opt-In Hero Public Share Card
- **Concept**: Public shareable graphic rendering character avatar, level, equipped title, and attribute radar chart.
- **Privacy Boundary**: Strictly opt-in, displaying no email, private task descriptions, or sensitive personal data.

### G. Co-Op Party Raids & Guilds
- **Concept**: Collaborative boss encounters where a party of adventurers pools completed quest base XP to defeat mythical titans.

### H. AI Quest Generation
- **Concept**: Integrating server-side LLMs to propose customized quest templates based on user goals.
- **Safety Boundary**: Generated suggestions must be reviewed and accepted by the user before creating quests; AI cannot directly grant rewards or bypass transactional engines.
