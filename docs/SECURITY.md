# Security Policy & Threat Model: Arcane Codex — Life RPG

## 1. Threat Model & Security Boundaries

Arcane Codex connects real-world human habits with virtual game progression. The threat model explicitly distinguishes between what the software can mathematically enforce and its physical honesty boundaries.

### Authoritative Enforcements (Guaranteed by Server)
- **Zero Stat Tampering**: Clients cannot submit XP, levels, gold, streak counters, or attribute bonuses. The server calculates all rewards transactionally.
- **Replay & Concurrency Prevention**: Every reward mutation accepts an `Idempotency-Key` header and records a cryptographic request fingerprint in `MutationReceipt`. Concurrent or repeated requests will never double-grant rewards or double-spend gold.
- **Strict Data Isolation**: All database queries for quests, completion logs, gold ledgers, receipts, and inventory records are strictly filtered by the authenticated `userId` derived from verified server sessions. No client-supplied owner IDs are trusted.
- **Reward Field Lock**: Once a quest has received a rewarded completion, difficulty, attribute, cadence, and weekly target fields are locked from modification to prevent retroactive reward tampering.
- **Timezone Anti-Exploit**: The user's activity timezone is permanently locked on the server after their first rewarded completion. This prevents repeatedly altering timezones to claim artificial multiple daily rewards.

### Honesty Boundary (Documented Limitation)
- The backend cryptographically guarantees that reward mathematics, currency balance, and single-occurrence constraints are respected.
- It **cannot physically verify** whether a user actually walked for 20 minutes, read 10 pages, or meditated. Arcane Codex is an authentic personal accountability partner, not a surveillance tool.

---

## 2. Authentication & Credential Storage
- **Algorithm**: bcrypt with cost factor 12.
- **72-Byte Truncation Guard**: Standard bcrypt algorithms silently truncate inputs past 72 UTF-8 bytes, creating a vulnerability where long passwords with identical prefixes hash to identical values. Arcane Codex explicitly validates byte length (`Buffer.byteLength(password, 'utf8') <= 72`) and rejects oversized inputs.
- **Minimum Length**: Strict minimum 8 characters enforced on both server and client.
- **Generic Responses**: Login failures return a generic `"Invalid email or password"` error to prevent email enumeration.

---

## 3. Session Management
- **HttpOnly Cookies**: Cryptographic session tokens are issued strictly in `HttpOnly`, `SameSite=Lax`, and `Secure` (production) cookies.
- **Zero LocalStorage Tokens**: Authentication tokens are never stored in browser `localStorage`, eliminating token extraction via arbitrary client scripts.
- **Explicit Invalidation**: Calling `POST /api/auth/logout` deletes the session from PostgreSQL and removes the client cookie.

---

## 4. Financial & Currency Integrity (Gold Ledger)
- Virtual Gold is tracked via an atomic double-entry ledger (`GoldLedger`).
- Every quest reward credits the ledger; every cosmetic purchase debits the ledger.
- A database composite unique constraint (`userId_sourceType_sourceId`) prevents duplicate credits or debits even under high network latency or retried submissions.
- Currency is represented solely as integers (zero floating-point currency drift).
