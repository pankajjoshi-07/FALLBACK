-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "activityTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "displayTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "timezoneLocked" BOOLEAN NOT NULL DEFAULT false,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT false,
    "motionReduced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "heroName" TEXT NOT NULL,
    "className" TEXT NOT NULL DEFAULT 'Warrior',
    "lifetimeXp" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "strengthXp" INTEGER NOT NULL DEFAULT 0,
    "intellectXp" INTEGER NOT NULL DEFAULT 0,
    "disciplineXp" INTEGER NOT NULL DEFAULT 0,
    "vitalityXp" INTEGER NOT NULL DEFAULT 0,
    "charismaXp" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TEXT,
    "equippedTheme" TEXT NOT NULL DEFAULT 'theme-midnight',
    "equippedAvatar" TEXT NOT NULL DEFAULT 'avatar-warrior',
    "equippedTitle" TEXT DEFAULT 'Novice Adventurer',
    "equippedFrame" TEXT DEFAULT 'frame-apprentice',
    "stateVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "cadence" TEXT NOT NULL,
    "weeklyTarget" INTEGER NOT NULL DEFAULT 1,
    "dueDate" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "questTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "occurrenceSlot" INTEGER NOT NULL DEFAULT 1,
    "xpAwarded" INTEGER NOT NULL,
    "goldAwarded" INTEGER NOT NULL,
    "streakSnapshot" INTEGER NOT NULL,
    "multiplierBps" INTEGER NOT NULL,
    "localActivityDate" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "gameRulesVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localDate" TEXT NOT NULL,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "goldEarned" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "levelRequirement" INTEGER NOT NULL DEFAULT 1,
    "effectKey" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoldLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutationReceipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responsePayload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutationReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "cadence" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBossInstance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekPeriod" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Procrastinus, Keeper of Delay',
    "maxHp" INTEGER NOT NULL DEFAULT 1500,
    "currentHp" INTEGER NOT NULL DEFAULT 1500,
    "isDefeated" BOOLEAN NOT NULL DEFAULT false,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBossInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossDamage" (
    "id" TEXT NOT NULL,
    "bossInstanceId" TEXT NOT NULL,
    "questCompletionId" TEXT NOT NULL,
    "damage" INTEGER NOT NULL,
    "dealtAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BossDamage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_userId_key" ON "Character"("userId");

-- CreateIndex
CREATE INDEX "Quest_userId_archivedAt_idx" ON "Quest"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "CompletionLog_userId_completedAt_idx" ON "CompletionLog"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "CompletionLog_userId_localActivityDate_idx" ON "CompletionLog"("userId", "localActivityDate");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionLog_userId_questId_periodKey_occurrenceSlot_key" ON "CompletionLog"("userId", "questId", "periodKey", "occurrenceSlot");

-- CreateIndex
CREATE INDEX "ActivityDay_userId_localDate_idx" ON "ActivityDay"("userId", "localDate");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityDay_userId_localDate_key" ON "ActivityDay"("userId", "localDate");

-- CreateIndex
CREATE UNIQUE INDEX "ShopItem_slug_key" ON "ShopItem"("slug");

-- CreateIndex
CREATE INDEX "ShopItem_category_active_idx" ON "ShopItem"("category", "active");

-- CreateIndex
CREATE INDEX "InventoryItem_userId_idx" ON "InventoryItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_userId_itemId_key" ON "InventoryItem"("userId", "itemId");

-- CreateIndex
CREATE INDEX "GoldLedger_userId_createdAt_idx" ON "GoldLedger"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoldLedger_userId_sourceType_sourceId_key" ON "GoldLedger"("userId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "MutationReceipt_userId_idempotencyKey_idx" ON "MutationReceipt"("userId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "MutationReceipt_userId_idempotencyKey_key" ON "MutationReceipt"("userId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestTemplate_slug_key" ON "QuestTemplate"("slug");

-- CreateIndex
CREATE INDEX "QuestTemplate_attribute_idx" ON "QuestTemplate"("attribute");

-- CreateIndex
CREATE INDEX "UserBossInstance_userId_idx" ON "UserBossInstance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBossInstance_userId_weekPeriod_key" ON "UserBossInstance"("userId", "weekPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "BossDamage_questCompletionId_key" ON "BossDamage"("questCompletionId");

-- CreateIndex
CREATE INDEX "BossDamage_bossInstanceId_idx" ON "BossDamage"("bossInstanceId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionLog" ADD CONSTRAINT "CompletionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionLog" ADD CONSTRAINT "CompletionLog_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityDay" ADD CONSTRAINT "ActivityDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ShopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldLedger" ADD CONSTRAINT "GoldLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationReceipt" ADD CONSTRAINT "MutationReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBossInstance" ADD CONSTRAINT "UserBossInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossDamage" ADD CONSTRAINT "BossDamage_bossInstanceId_fkey" FOREIGN KEY ("bossInstanceId") REFERENCES "UserBossInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

