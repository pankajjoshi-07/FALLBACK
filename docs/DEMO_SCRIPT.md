# Walkthrough Demo Script: Arcane Codex — Life RPG

**Target Total Duration**: 150–160 seconds (strictly between 90 and 180 seconds)  
**Target Video Size**: Under 90 MB (well within the <100 MB requirement)  
**Access Requirement**: Publicly viewable without login or permissions gate

---

## Chronological Cue Sequence

### 0:00 – 0:15 | Scene 1: Public Awakening (Landing Page)
- **Visual**: Start on the Arcane Codex homepage at the top hero section.
- **Narration**: *"Welcome to Arcane Codex — Life RPG, where your real-world effort transforms into a living legend. Unlike static to-do lists or fragile prototypes, Arcane Codex connects real studying, fitness, and habits to server-verified progression backed by PostgreSQL."*
- **Action**: Hover over the dark fantasy typography and scroll smoothly down to show the interactive reward sandbox and the three core pillars (PostgreSQL Persistence, Grace over Shame, Transparent Progression).

### 0:15 – 0:40 | Scene 2: Hero Inscription (Registration & Session)
- **Visual**: Click "Forge Your Hero" in the top header. Land on `/register`.
- **Narration**: *"Let's forge a fresh hero account. Notice our auto-detected IANA activity timezone, which locks after our first quest to prevent timezone-switching exploits. We choose our Scholar archetype and set a secure 12-character cipher."*
- **Action**: Enter display name `"Aethelgard"`, email `"demo@arcanecodex.realm"`, cipher `"ArcaneCipher2026!"`, select the Scholar class card, and submit.
- **Result**: Server creates the account, hashes the cipher with bcrypt (cost 12), sets an HttpOnly session cookie, and seamlessly lands on `/dashboard`.

### 0:40 – 1:05 | Scene 3: The Quest Board & Template Codex
- **Visual**: Dashboard view showing the Character HUD at Level 1, 0 XP, 0 Gold, Streak 0.
- **Narration**: *"Here is our Tavern Quest Board. New adventurers can forge custom quests or adopt from over 50 curated templates across Strength, Intellect, Discipline, Vitality, and Charisma."*
- **Action**: Click "Forge Quest", open the modal, switch to "Template Codex", and adopt:
  1. *"Read 10 Pages of a Non-Fiction Book"* (Intellect · MEDIUM · 50 XP, 30 Gold)
  2. *"Solve One Algorithmic Challenge"* (Intellect · MEDIUM · 50 XP, 30 Gold)
  3. Forge a custom quest: *"Complete priority architecture review"* (Discipline · MEDIUM · 50 XP, 30 Gold)

### 1:05 – 1:35 | Scene 4: The Deterministic Reward Loop & Ascension
- **Visual**: The 3 MEDIUM quests displayed on the active Quest Board.
- **Narration**: *"Now we complete our real-world tasks. Watch the instant responsive pending state and procedural audio chime, followed by authoritative server confirmation."*
- **Action**:
  - Click "Complete" on Quest 1: Floating `+50 XP` and `+30 Gold` appears. Lifetime XP reaches 50, Gold reaches 30, streak becomes 1.
  - Click "Complete" on Quest 2: Lifetime XP reaches 100!
  - **Celebration**: The `LevelUpModal` erupts with a confetti burst and heroic fanfare!
  - Narration: *"We have crossed the exact 100 XP threshold into Level 2! Notice our before-and-after level indicator and unlocked privileges."*
  - Click "Claim Glory & Continue".
  - Click "Complete" on Quest 3: Lifetime XP reaches 150 (50/175 XP into Level 2), and treasury gold reaches exactly 90 Gold.

### 1:35 – 1:50 | Scene 5: Authentic Persistence (Hard Refresh)
- **Visual**: Full browser window.
- **Narration**: *"Is this real database persistence or browser trickery? Let's perform a visible hard refresh."*
- **Action**: Press `Ctrl + Shift + R` (or browser Reload).
- **Result**: The page reloads from PostgreSQL via Prisma. Level 2, 50/175 XP progress bar, 90 Gold balance, completed checkmarks, and 1-day streak all reload instantly and identically.

### 1:50 – 2:15 | Scene 6: The Merchant Bazaar & Live Dynamic Theming
- **Visual**: Navigate to the "Merchant Bazaar" tab.
- **Narration**: *"With our 90 Gold and Level 2 qualification, we can now enter the Bazaar and purchase the permanent Crimson Covenant theme."*
- **Action**: Find "Crimson Covenant" in the Theme catalog. Click "Purchase" (90 Gold deducted to 0 Gold, ledger debit created). Click "Equip Relic".
- **Result**: The entire application immediately transforms into the blood-moon Crimson Covenant palette via root CSS variables!
- **Narration**: *"Notice the instantaneous theme shift across our background, panels, borders, and glows. This equipped cosmetic is persisted to the database and will survive re-login."*

### 2:15 – 2:35 | Scene 7: Character Sheet, Chronicle & Accessibility
- **Visual**:
  - Tab over to **Character Sheet**: Show the 5 Attribute cards (Strength, Intellect at Level 2, Discipline, Vitality, Charisma), achievement badges ("First Steps into Legend", "Merchant's Patron").
  - Tab over to **Chronicle**: Show the 12-week Activity Heatmap grid with today's 3 completed deeds, and the immutable audit log below.
  - Show the **Personal Weekly Boss** ("Procrastinus, Keeper of Delay") with 150 damage dealt from our 3 MEDIUM quests.
  - Resize browser viewport to 375px (mobile) to demonstrate responsive bottom navigation and single-column touch UX.
  - Demonstrate keyboard navigation with `Tab` focus rings.

### 2:35 – 2:40 | Scene 8: Closing & Open Source Deliverable
- **Visual**: Display the public GitHub repository and documentation index.
- **Narration**: *"Arcane Codex — Life RPG is fully open-source with 100% test coverage, comprehensive architectural diagrams, and production deployment on Vercel and Neon PostgreSQL. Thank you."*
