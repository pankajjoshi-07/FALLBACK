# Architecture Decisions Log: Arcane Codex — Life RPG

## ADR-001: Next.js 15 Monolith with App Router and Node.js Runtime
- **Context**: Need a cohesive, high-performance web application combining SSR landing pages, API route handlers, and client-side interactive game state.
- **Decision**: Next.js 15 App Router with Node.js runtime for API handlers and database transactions.
- **Rationale**: Full type-safety across client and server, first-class SEO support, robust cookie/session handling, and full compatibility with Prisma ORM without edge-runtime constraints.

## ADR-002: Real PostgreSQL via Prisma ORM
- **Context**: Non-negotiable requirement that PostgreSQL is the true source of truth.
- **Decision**: Use Prisma with schema models enforcing relations, composite unique constraints (`userId_periodKey_occurrenceSlot`), foreign keys, and cascading behavior.
- **Rationale**: Strict relational modeling prevents orphan records and guarantees data integrity for financial/progression ledgers.

## ADR-003: Session Management with Cryptographic HttpOnly Cookies
- **Context**: Need production-grade authentication with credential support that prevents token theft via XSS while maintaining simplicity without third-party auth outages.
- **Decision**: Built-in cryptographic session management using HMAC-SHA256 tokens stored in HttpOnly, SameSite=Lax, Secure cookies, coupled with bcrypt password hashing (cost factor 12, strict 72-byte check).
- **Rationale**: Full control over session lifetime and revocation, zero third-party external dependencies, and strict defense against token leakage to client scripts.

## ADR-004: CSS Variable-Driven Theme Swapping
- **Context**: Purchased themes (Crimson Covenant, Emerald Grove, Midnight Codex) must take effect immediately upon equip, persist to the database, and survive hard refresh.
- **Decision**: Bind high-level color tokens (`--color-page`, `--color-panel`, `--color-border`, `--color-gold`, `--color-xp`) to CSS variables modulated by `data-theme` attribute on the root HTML document.
- **Rationale**: Avoids costly page reloads or Tailwind class re-evaluations while maintaining complete visual fidelity across all custom components.

## ADR-005: Period Keys for Quest Recurrence
- **Context**: Fragile midnight cron jobs fail across timezones, daylight saving transitions, and user geographic moves.
- **Decision**: Recurrence is evaluated purely on demand using server-calculated period keys:
  - `ONCE`: Unique stable key `"ONCE"`
  - `DAILY`: `"DAY:YYYY-MM-DD"` in user's activity timezone
  - `WEEKLY`: `"WEEK:YYYY-MM-DD"` anchored to local Monday
- **Rationale**: 100% deterministic, zero cron daemon failures, and prevents timezone-switching exploitation by locking activity timezone after the first reward.

## ADR-006: Web Audio API Synthesizer for Audio Feedback
- **Context**: Need rewarding sound effects (quest completion chimes, level-up fanfare) without broken external asset links, massive bandwidth overhead, or copyright risks.
- **Decision**: Lightweight Web Audio API synthesizer synthesizing soft musical chords/fanfares, disabled by default, persisting user mute preference to localStorage.
- **Rationale**: Zero external audio downloads, zero 404 risks, instantly responsive audio, and completely accessible with visible text cues.
