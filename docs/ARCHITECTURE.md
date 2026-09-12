# Architecture & System Design: Arcane Codex — Life RPG

This document outlines the end-to-end technical architecture, data model, transactional workflows, and state-reconciliation mechanisms implemented in Arcane Codex.

---

## 1. System Architecture

```mermaid
graph TD
    Client["Browser UI (Next.js Client, Tailwind, Framer Motion)"]
    TanStack["TanStack Query Cache & Optimistic Reconciliation"]
    AuthCookie["HttpOnly / SameSite Cryptographic Session Cookie"]
    
    subgraph Server ["Next.js Full-Stack Monolith (Node.js Runtime)"]
        RouteHandlers["API Route Handlers (/api/quests, /api/shop, /api/auth)"]
        AuthService["Session & Security Service (bcrypt cost 12, max 72 bytes)"]
        CompletionService["Transactional Completion Engine"]
        PurchaseService["Atomic Purchase & Inventory Engine"]
        ProgressionCore["Pure Game Rules Engine (Math, Curves, Streaks)"]
    end
    
    subgraph Database ["PostgreSQL (Prisma ORM Source of Truth)"]
        Users["Users & Characters"]
        Quests["Quests (Active & Archived)"]
        Completions["CompletionLog (Immutable Snapshots)"]
        Ledger["GoldLedger (Double-Entry Balance Audits)"]
        Receipts["MutationReceipt (Idempotency Records)"]
        Inventory["Inventory & Equipped Cosmetics"]
        BossTable["Weekly Boss Instances & Damage Logs"]
    end

    Client <--> TanStack
    Client -- "Fetch / Mutations (HTTPS + Session Cookie)" --> RouteHandlers
    RouteHandlers --> AuthService
    RouteHandlers --> CompletionService
    RouteHandlers --> PurchaseService
    CompletionService --> ProgressionCore
    PurchaseService --> ProgressionCore

    CompletionService -- "Atomic DB Transaction & Row Locks" --> Database
    PurchaseService -- "Atomic Balance Deduction & Ownership" --> Database
    AuthService --> Database
```

---

## 2. User Journey

```mermaid
journey
    title Adventurer Odyssey: From Everyday Effort to Legend
    section Awakening
      Visit Public Landing Page: 5: Adventurer
      Interact with Reward Simulator: 4: Adventurer
      Forge Hero Account (Choose Archetype): 5: Adventurer
    section The Quest Board
      Browse Starter & 50+ Curated Templates: 5: Adventurer
      Inscribe Custom Real-Life Quest: 5: Adventurer
      Complete Real-World Task (e.g. 20-min Walk): 4: Adventurer
    section Reward Confirmation
      Click Complete & Experience +XP Chime: 5: Hero
      Server Verifies Idempotency & Recurrence: 5: Engine
      Hero Ascends to Level 2 (Confetti & Fanfare): 5: Hero
    section The Bazaar & Chronicle
      Visit Merchant Bazaar: 5: Hero
      Acquire & Live-Equip Crimson Covenant Theme: 5: Hero
      Review Activity Heatmap in the Chronicle: 5: Hero
      Refresh or Re-login from Another Device: 5: Hero
```

---

## 3. Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o| Character : owns
    User ||--o{ Session : holds
    User ||--o{ Quest : creates
    User ||--o{ CompletionLog : records
    User ||--o{ ActivityDay : logs
    User ||--o{ InventoryItem : possesses
    User ||--o{ GoldLedger : audits
    User ||--o{ MutationReceipt : registers
    User ||--o{ UserAchievement : achieves
    User ||--o{ UserBossInstance : fights

    ShopItem ||--o{ InventoryItem : contains
    Achievement ||--o{ UserAchievement : recognizes
    UserBossInstance ||--o{ BossDamage : sustains
    Quest ||--o{ CompletionLog : generates

    User {
        string id PK
        string email UK
        string passwordHash
        string displayName
        string activityTimezone
        boolean timezoneLocked
    }

    Character {
        string id PK
        string userId FK
        int lifetimeXp
        int gold
        int currentStreak
        int longestStreak
        string equippedTheme
        string equippedAvatar
        int stateVersion
    }

    Quest {
        string id PK
        string userId FK
        string title
        string difficulty
        string attribute
        string cadence
        int weeklyTarget
        datetime archivedAt
    }

    CompletionLog {
        string id PK
        string userId FK
        string questId FK
        string periodKey
        int occurrenceSlot
        int xpAwarded
        int goldAwarded
        string localActivityDate
    }

    GoldLedger {
        string id PK
        string userId FK
        int amount
        int balanceAfter
        string sourceType
        string sourceId
    }

    MutationReceipt {
        string id PK
        string userId FK
        string idempotencyKey UK
        string requestHash
        string responsePayload
    }
```

---

## 4. Signup & Login Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Adventurer
    participant Client as Next.js Client
    participant API as /api/auth/login or /register
    participant SessionMgr as Session Manager
    participant DB as PostgreSQL

    User->>Client: Enters credentials (email + cipher >=12 chars)
    Client->>API: POST credentials
    API->>API: Validate input with Zod (strictly <=72 UTF-8 bytes)
    alt Registration
        API->>API: Hash password via bcrypt (cost factor 12)
        API->>DB: Atomically create User, Character, & initial GoldLedger
    else Login
        API->>DB: Query User by normalized email
        API->>API: Verify password hash
    end
    API->>SessionMgr: Generate cryptographic 256-bit session token
    SessionMgr->>DB: Store Session record with expiration
    SessionMgr-->>API: Issue HttpOnly, SameSite=Lax cookie
    API-->>Client: 200 OK + User & Character payload (Zero secrets exposed)
    Client->>Client: Redirect to /dashboard
```

---

## 5. Transactional Quest Completion Engine

```mermaid
sequenceDiagram
    autonumber
    actor User as Adventurer
    participant UI as QuestCard
    participant Route as /api/quests/:id/complete
    participant Engine as Completion Engine
    participant DB as PostgreSQL Transaction

    User->>UI: Clicks "Complete" button
    UI->>UI: Lock button & trigger local pending chime
    UI->>Route: POST /api/quests/:id/complete (Header: Idempotency-Key)
    Route->>Route: Authenticate session from HttpOnly cookie
    Route->>Engine: completeQuestTransaction(userId, questId, key)
    
    Engine->>DB: BEGIN TRANSACTION
    Engine->>DB: Check MutationReceipt(userId, idempotencyKey)
    opt Already processed with matching hash
        Engine-->>Route: Return previous authoritative result (isReplay=true)
    end
    
    Engine->>DB: Fetch Quest & Character (Verify owner & not archived)
    Engine->>Engine: Compute Period Key (DAY:YYYY-MM-DD or WEEK:YYYY-MM-DD)
    Engine->>DB: Count existing completions in this period
    alt Target already reached
        Engine-->>Route: 409 Conflict (Occurrence already claimed)
    end
    
    Engine->>Engine: Calculate Streak, Multiplier Bps, XP, Gold, & Attribute growth
    Engine->>DB: Insert CompletionLog snapshot
    Engine->>DB: Upsert ActivityDay record
    Engine->>DB: Insert GoldLedger credit (+gold)
    Engine->>DB: Update Character (lifetimeXp, gold, streak, stateVersion++)
    Engine->>DB: Apply Base XP damage to active Weekly Boss
    Engine->>DB: Evaluate & grant new Achievements
    Engine->>DB: Insert MutationReceipt with serialized result payload
    Engine->>DB: COMMIT
    
    Engine-->>Route: Authoritative Response + Emitted Events
    Route-->>UI: 200 OK
    UI->>UI: Reconcile TanStack Query state & show LevelUpModal if promoted
```

---

## 6. Streak & Multiplier Calculation

```mermaid
flowchart TD
    Start([Quest Completion Event]) --> CheckPrior{Prior activity date exists?}
    CheckPrior -- No --> FirstDay[Streak = 1\nLongest = 1]
    CheckPrior -- Yes --> CompareDate{Compare lastActivityDate to todayLocalDate}
    
    CompareDate -- Same Date --> SameDay[Streak unchanged\nMaintain current momentum]
    CompareDate -- Strictly Yesterday --> Consecutive[Streak = Streak + 1\nLongest = max(longest, new)]
    CompareDate -- Older than Yesterday --> Reset[Streak = 1\nLongest preserved without penalty]

    FirstDay --> CalcBonus
    SameDay --> CalcBonus
    Consecutive --> CalcBonus
    Reset --> CalcBonus

    CalcBonus["bonusSteps = min(max(streak - 1, 0), 25)\nmultiplierBps = 10000 + 200 * bonusSteps\n(1.00x to 1.50x bonus)"]
    CalcBonus --> Reward["xpAwarded = floor(baseXp * multiplierBps / 10000)\ngoldAwarded = floor(xpAwarded * 60 / 100)"]
```

---

## 7. Purchase & Cosmetic Equipment Transaction

```mermaid
sequenceDiagram
    autonumber
    actor Hero as Adventurer
    participant UI as Marketplace
    participant Route as /api/shop/purchases & /equip
    participant Engine as Purchase Engine
    participant DB as PostgreSQL

    Hero->>UI: Clicks "Purchase" for Crimson Covenant Theme (90 Gold)
    UI->>Route: POST /api/shop/purchases (itemId, Idempotency-Key)
    Route->>Engine: purchaseItemTransaction(userId, itemId)
    Engine->>DB: BEGIN TRANSACTION
    Engine->>DB: Lock User Character row
    Engine->>DB: Check MutationReceipt for idempotency
    Engine->>DB: Verify active status & level requirement (Level >= 2)
    Engine->>DB: Verify user has sufficient gold (Gold >= 90)
    Engine->>DB: Check if permanent relic is already owned
    Engine->>DB: Deduct gold from Character (gold = gold - 90, stateVersion++)
    Engine->>DB: Insert InventoryItem record
    Engine->>DB: Insert GoldLedger debit (-90 Gold)
    Engine->>DB: Check "Merchant's Patron" Achievement
    Engine->>DB: Save MutationReceipt
    Engine->>DB: COMMIT
    Engine-->>Route: Purchase Confirmed
    Route-->>UI: 200 OK
    Hero->>UI: Clicks "Equip"
    UI->>Route: POST /api/inventory/equip (itemId)
    Route->>DB: Update Character.equippedTheme = 'theme-crimson'
    Route-->>UI: 200 OK
    UI->>UI: Immediately set document root data-theme='theme-crimson'
```

---

## 8. Optimistic UI & Uncertain-Response Recovery

```mermaid
sequenceDiagram
    autonumber
    actor User as Adventurer
    participant Client as TanStack Client
    participant Server as Completion API
    participant Receipt as /api/mutations/:key

    User->>Client: Click Complete
    Client->>Client: Lock card, play audio, show pending spinner
    Client->>Server: POST /api/quests/:id/complete (Idempotency-Key: UUID)
    
    alt Normal Success
        Server-->>Client: 200 OK (Authoritative State)
        Client->>Client: Update cache & reconcile stateVersion
    else Network Dropped / Timeout
        Client->>Client: Display: "Verifying confirmation with the Codex..."
        Client->>Receipt: GET /api/mutations/:UUID
        alt Receipt Found (Server committed before disconnect)
            Receipt-->>Client: 200 OK (Original Authoritative Result)
            Client->>Client: Silently reconcile state without lost progress
        else Receipt Not Found
            Client->>Server: Safely replay POST /api/quests/:id/complete with same UUID
        end
    end
```

---

## 9. Deployment Pipeline

```mermaid
flowchart LR
    Git["Git Commit to Main Branch"] --> Lint["ESLint & TypeScript Typecheck"]
    Lint --> Vitest["Vitest Unit & Integration Suites (38+ tests)"]
    Vitest --> Migration["Prisma db migrate deploy (Controlled Step)"]
    Migration --> NextBuild["Next.js Production Build (Vercel)"]
    NextBuild --> Edge["Edge CDN / Serverless Node.js Handlers"]
    Edge --> Neon["PostgreSQL (Neon / Pooled Connection)"]
```
