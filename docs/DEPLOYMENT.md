# Deployment Guide: Arcane Codex — Life RPG

## Recommended Production Architecture

- **Web Hosting**: Vercel (Edge CDN + Node.js Serverless Route Handlers)
- **Database**: Neon Serverless PostgreSQL (or Supabase / AWS RDS PostgreSQL)
- **Runtime**: Node.js runtime for API route handlers and Prisma ORM

---

## Environment Configuration

In your production hosting environment (e.g. Vercel Project Settings > Environment Variables), configure the following:

```ini
# PostgreSQL Connection URL with Connection Pooling
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct URL for schema migrations
DIRECT_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Production Application Base URL
NEXT_PUBLIC_APP_URL="https://arcane-codex.vercel.app"

# Cryptographic secret for signing session cookies (minimum 32 characters)
AUTH_SECRET="your-production-high-entropy-cryptographic-secret-key-32-chars"

# Node environment
NODE_ENV="production"
```

---

## Controlled Database Migration Step

Never let uncontrolled build steps run destructive migrations. Use the standard deployment command:

```bash
# 1. Apply schema migrations
npx prisma migrate deploy

# 2. Seed initial templates, shop catalog, and achievements (idempotent)
npx tsx prisma/seed.ts

# 3. Build Next.js bundle
npm run build
```

---

## Production Verification Checklist (Smoke Test)

1. **Incognito Public Access**:
   - Open production URL in a fresh incognito window.
   - Verify landing page hero, fonts (Cinzel, Sora), interactive preview sandbox, and FAQ load with 0 console errors.

2. **Hero Account Creation**:
   - Navigate to `/register`.
   - Inscribe a new hero with a test email and >=12 character cipher.
   - Verify immediate redirect to `/dashboard` with Session cookie set (`HttpOnly`, `Secure`, `SameSite=Lax`).

3. **Quest Inscription & Completion**:
   - Inscribe a custom MEDIUM quest or adopt one from the 52-item Template Codex.
   - Click "Complete": verify instant pending state, floating `+50 XP` and `+30 Gold` indicator, and procedural audio chime.
   - Complete 3 MEDIUM quests: verify 150 lifetime XP, Level 2 promotion, and Level-Up celebration modal with confetti.

4. **Merchant Bazaar & Live Theming**:
   - Navigate to Bazaar tab.
   - Purchase the Crimson Covenant theme for 90 Gold.
   - Equip it and verify the page background, borders, and glows instantaneously switch to blood-moon crimson via CSS variables.

5. **Cross-Device / Hard Refresh Persistence**:
   - Perform a hard refresh (`Ctrl + Shift + R`).
   - Verify that Level 2, 90 Gold, Crimson theme, and completion records persist identically.
   - Sign in from a secondary browser or mobile viewport and confirm identical state.
