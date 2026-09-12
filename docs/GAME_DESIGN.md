# Game Design Document: Arcane Codex — Life RPG

## 1. Vision & Core Philosophy
Arcane Codex is a dark-fantasy life RPG designed to transform personal productivity, habit consistency, and self-improvement into tangible heroic growth.

**Guiding Principles:**
- **Immediacy**: Completing a quest yields immediate, server-verified rewards (XP, Gold, Attribute progress).
- **Grace over Punishment**: Missed days reset streak streaks without destroying health, stealing gold, or degrading character levels.
- **Transparency**: Every reward formula is deterministic, documented, and enforced on the server.
- **Authentic Persistence**: Every stat and transaction lives in PostgreSQL; no localStorage spoofing.

---

## 2. Attributes System
Character growth distributes into five core archetypes:

| Attribute | Focus Area | Exemplary Quests | Visual Accent |
| :--- | :--- | :--- | :--- |
| **STRENGTH** | Physical health, exercise, mobility, stamina | Workouts, walking, stretching, cycling | `#F87171` (Crimson) |
| **INTELLECT** | Learning, coding, reading, problem-solving | Reading 10 pages, coding challenge, research | `#60A5FA` (Arcane Azure) |
| **DISCIPLINE** | Organization, focus, deep work, routine | Planning tomorrow, workspace cleanup, focus session | `#FBBF24` (Amber Gold) |
| **VITALITY** | Recovery, mental well-being, mindfulness | Meditation, hydration, nature walk, sleep hygiene | `#34D399` (Emerald) |
| **CHARISMA** | Connection, communication, social courage | Phone call, presentation practice, networking | `#C084FC` (Mystic Purple) |

### Attribute Level Formula
$$\text{attributeLevel} = 1 + \left\lfloor \sqrt{\frac{\text{attributeXp}}{100}} \right\rfloor$$

| Attribute XP | Level |
| :--- | :--- |
| 0 – 99 XP | Level 1 |
| 100 – 399 XP | Level 2 |
| 400 – 899 XP | Level 3 |
| 900 – 1599 XP | Level 4 |
| 1600 – 2499 XP | Level 5 |

---

## 3. Experience & Leveling Curve

### Quest Difficulty Base XP
- **TRIVIAL**: 10 XP
- **EASY**: 25 XP
- **MEDIUM**: 50 XP
- **HARD**: 90 XP
- **EPIC**: 150 XP

### Level Curve Formula
For current level $L \ge 1$, let $n = L - 1$:
$$\text{xpRequiredToAdvance}(L) = 100 + 50n + 25n^2$$

### Exact Progression Table (Levels 1 to 10)
| Level | XP Required to Next Level | Cumulative Lifetime XP to Reach |
| :--- | :--- | :--- |
| **1** | 100 XP | 0 XP |
| **2** | 175 XP | 100 XP |
| **3** | 300 XP | 275 XP |
| **4** | 475 XP | 575 XP |
| **5** | 700 XP | 1,050 XP |
| **6** | 975 XP | 1,750 XP |
| **7** | 1,300 XP | 2,725 XP |
| **8** | 1,675 XP | 4,025 XP |
| **9** | 2,100 XP | 5,700 XP |
| **10** | 2,575 XP | 7,800 XP |

*Level cap is set at Level 100 ("MAX"). Lifetime XP continues to accumulate authoritatively.*

---

## 4. Streaks & Multipliers
- Activity is tracked per local calendar day in the user's locked activity timezone.
- **Streak Rules**:
  - No prior activity $\rightarrow$ Streak = 1
  - Last active date is today $\rightarrow$ Streak unchanged
  - Last active date is yesterday $\rightarrow$ Streak = Streak + 1
  - Last active date is earlier $\rightarrow$ Streak resets to 1
  - Displayed streak shows 0 if last active date is older than yesterday.

### Streak Bonus Multiplier Formula
$$\text{bonusSteps} = \min(\max(\text{streak} - 1, 0), 25)$$
$$\text{multiplierBps} = 10000 + 200 \times \text{bonusSteps} \quad (1.00\times \text{ to } 1.50\times)$$
$$\text{xpAwarded} = \left\lfloor \frac{\text{baseXp} \times \text{multiplierBps}}{10000} \right\rfloor$$
$$\text{goldAwarded} = \left\lfloor \frac{\text{xpAwarded} \times 60}{100} \right\rfloor$$

---

## 5. Economy & Catalog
Gold is awarded on every confirmed completion. Cosmetic items grant visual customizability without pay-to-win mechanics:
- **Title: “The Focused”**: 45 Gold, Level 1
- **Scholar Avatar**: 60 Gold, Level 1
- **Crimson Covenant Theme**: 90 Gold, Level 2
- **Emerald Grove Theme**: 120 Gold, Level 2
- **Decorative Profile Badge**: 30 Gold, Level 1
- **Golden Profile Frame**: 300 Gold, Level 3

*All items are verified on the server, cannot be purchased twice if permanent, and debit from the atomic `GoldLedger`.*

---

## 6. Personal Weekly Boss: Procrastinus
- Spawned fresh each calendar week (Monday to Sunday in activity timezone).
- Max HP: 1,500.
- Damage dealt equals base XP of completed quests.
- Upon defeat, awards 150 bonus Gold and grants the "Bane of Delay" achievement.
- If undefeated at week's end, the boss resets gracefully without penalty.
