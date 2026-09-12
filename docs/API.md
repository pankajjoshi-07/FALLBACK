# API Reference Documentation: Arcane Codex — Life RPG

All API route endpoints adhere to consistent typed JSON schemas and proper HTTP status codes.

---

## Authentication Endpoints

### 1. Register Hero
- **Route**: `POST /api/auth/register`
- **Authentication**: None
- **Body**:
  ```json
  {
    "email": "hero@arcanecodex.realm",
    "password": "strong-secret-password-12-chars",
    "displayName": "Aethelgard",
    "heroName": "Aethelgard the Resolute",
    "className": "Scholar",
    "activityTimezone": "America/New_York"
  }
  ```
- **Validation**:
  - `email`: Valid email format
  - `password`: Length >= 12, UTF-8 byte length <= 72 (prevents bcrypt truncation)
  - `displayName`: 2 to 40 characters
  - `className`: One of `Warrior`, `Scholar`, `Monk`, `Bard`, `Artisan`
- **Response**: `201 Created`
  - Sets HttpOnly, SameSite=Lax session cookie `arcane_session`.
  ```json
  {
    "ok": true,
    "data": {
      "id": "cuid-user-id",
      "email": "hero@arcanecodex.realm",
      "displayName": "Aethelgard",
      "activityTimezone": "America/New_York",
      "character": {
        "heroName": "Aethelgard the Resolute",
        "className": "Scholar",
        "level": 1,
        "lifetimeXp": 0,
        "gold": 0,
        "currentStreak": 0,
        "longestStreak": 0
      }
    }
  }
  ```

### 2. Login
- **Route**: `POST /api/auth/login`
- **Body**: `{ "email": "hero@arcanecodex.realm", "password": "..." }`
- **Response**: `200 OK` (sets `arcane_session` cookie) or `401 Unauthorized` (generic message: "Invalid email or password").

### 3. Logout
- **Route**: `POST /api/auth/logout`
- **Response**: `200 OK` (clears cookie & deletes session in DB).

---

## Profile & Character Endpoints

### 4. Get Current Profile
- **Route**: `GET /api/me`
- **Headers**: Cookie `arcane_session`
- **Response**: `200 OK`
  ```json
  {
    "ok": true,
    "data": {
      "id": "cuid-user-id",
      "displayName": "Aethelgard",
      "activityTimezone": "America/New_York",
      "timezoneLocked": true,
      "character": {
        "heroName": "Aethelgard the Resolute",
        "level": 2,
        "lifetimeXp": 150,
        "currentLevelXp": 50,
        "xpRequiredForNext": 175,
        "progressPercent": 29,
        "gold": 90,
        "effectiveStreak": 1
      },
      "attributes": {
        "INTELLECT": {
          "level": 2,
          "currentXp": 150,
          "nextLevelThresholdXp": 400,
          "progressPercent": 17
        }
      },
      "achievements": [],
      "totalCompletions": 3
    }
  }
  ```

### 5. Update Profile
- **Route**: `PATCH /api/me`
- **Body**: `{ "displayName": "New Name", "heroName": "New Moniker", "activityTimezone": "..." }`
- **Rules**: `activityTimezone` is rejected with `409 Conflict` if `timezoneLocked` is true.

---

## Quest Board Endpoints

### 6. List Active Quests
- **Route**: `GET /api/quests?attribute=INTELLECT&cadence=DAILY&search=reading`
- **Response**: Array of active quests decorated with `isCompletedForPeriod` and `rewardPreview`.

### 7. Inscribe Quest
- **Route**: `POST /api/quests`
- **Body**:
  ```json
  {
    "title": "Read 10 pages",
    "description": "Software architecture study",
    "difficulty": "MEDIUM",
    "attribute": "INTELLECT",
    "cadence": "DAILY",
    "weeklyTarget": 1
  }
  ```
- **Response**: `201 Created`

### 8. Complete Quest (Transactional Engine)
- **Route**: `POST /api/quests/:id/complete`
- **Headers**: `Idempotency-Key: <UUID>`
- **Response**: `200 OK`
  ```json
  {
    "ok": true,
    "data": {
      "quest": { "id": "...", "title": "Read 10 pages" },
      "character": {
        "level": 2,
        "lifetimeXp": 150,
        "gold": 90,
        "currentStreak": 1
      },
      "reward": {
        "xpAwarded": 50,
        "goldAwarded": 30,
        "multiplierBps": 10000,
        "multiplierDecimal": 1.0
      }
    },
    "events": [
      {
        "id": "level-up-2",
        "type": "LEVEL_UP",
        "payload": { "fromLevel": 1, "toLevel": 2, "levelsGained": 1 }
      }
    ],
    "stateVersion": 4
  }
  ```

---

## Economy & Inventory Endpoints

### 9. Shop Catalog
- **Route**: `GET /api/shop`
- **Response**: Array of cosmetic items with `isOwned`, `isEquipped`, and `canAfford`.

### 10. Purchase Relic
- **Route**: `POST /api/shop/purchases`
- **Headers**: `Idempotency-Key: <UUID>`
- **Body**: `{ "itemId": "cuid-item-id" }`
- **Response**: `200 OK` or `409 Conflict` (insufficient gold, level too low, already owned).

### 11. Equip Cosmetic
- **Route**: `POST /api/inventory/equip`
- **Body**: `{ "itemId": "cuid-item-id" }`
- **Response**: `200 OK` with updated character cosmetic reference.
