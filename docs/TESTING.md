# Test Suite & Verification Documentation: Arcane Codex

Arcane Codex utilizes Vitest for high-speed unit and integration testing across mathematical game curves, streak logic, economy validations, and template integrity.

---

## Running the Automated Test Suite

```bash
# Run complete test suite
npm test

# Run tests in watch mode
npm run test:watch

# Run TypeScript compilation check
npm run typecheck

# Run production build validation
npm run build
```

---

## Test Coverage Breakdown

### 1. Progression Engine (`tests/unit/progression.test.ts`)
- **Difficulty Mapping**: Verified exact XP constants (TRIVIAL 10, EASY 25, MEDIUM 50, HARD 90, EPIC 150).
- **Non-Linear Level Curve**: Verified $xpRequiredToAdvance(L) = 100 + 50n + 25n^2$ for levels 1 to 6 (100, 175, 300, 475, 700).
- **Exact Boundary Transitions**: Verified 99 XP is Level 1 (99%), 100 XP is Level 2 (0%), and 150 XP is Level 2 (50/175 XP).
- **Multi-Level Jumps**: Verified 600 XP awarded at once leaps from Level 1 directly to Level 4 (25/475 XP).
- **Level Cap**: Verified Level 100 ("MAX") cap, ensuring total lifetime XP continues to accumulate safely without overflow.
- **Attribute Formula**: Verified $\text{attributeLevel} = 1 + \lfloor\sqrt{\text{attributeXp} / 100}\rfloor$ across exact thresholds (0, 99, 100, 399, 400, 899, 900, 1000).

### 2. Streak & Timezone Engine (`tests/unit/streaks.test.ts`)
- **Calendar Date Arithmetic**: Tested consecutive day detection across standard days, month boundaries (Feb 28 to Mar 1), leap year boundaries (Feb 28 to Feb 29 in leap year), and year-end boundaries (Dec 31 to Jan 1).
- **Streak Evaluation**:
  - First activity day: streak = 1, longest = 1
  - Same calendar day: streak unchanged
  - Consecutive day: streak incremented by 1, longest updated
  - Missed day: streak resets to 1, longest preserved without penalty
- **Effective Display Streak**: Returns 0 if last active was older than yesterday; retains streak if active today or yesterday.
- **Streak Bonus Multipliers**: Verified integer basis points from 10000 bps (1.00x at Day 1) up to 15000 bps (1.50x capped at 25 consecutive steps).
- **Period Key Derivation**: Verified Monday anchoring for weekly contracts and date formatting for daily rituals.

### 3. Economy & Achievements (`tests/unit/economy.test.ts`)
- **Purchase Validation**: Verifies level requirements and gold balance checks; rejects purchases when gold is deficient; prevents duplicate acquisitions of permanent relics.
- **Cosmetic Equipment**: Validates allowlisted themes (`theme-midnight`, `theme-crimson`, `theme-emerald`), avatars, and titles. Rejects arbitrary CSS injection attempts.
- **Achievement Unlocks**: Verifies conditions for first quest, 10 quests, Level 5, 1000 Intellect XP, first purchase, and weekly boss slay.

### 4. Template Codex (`tests/unit/templates.test.ts`)
- **Quantity & Distribution**: Confirms >=50 curated, editable templates (52 total) with balanced distribution (>=10 in Strength, Intellect, Discipline, Vitality, Charisma).
- **Schema Validity**: Confirms all templates have valid unique slugs, supported difficulties, and supported cadences.
