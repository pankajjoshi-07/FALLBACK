import { PrismaClient } from "@prisma/client";
import { INITIAL_SHOP_ITEMS, INITIAL_ACHIEVEMENTS, INITIAL_TEMPLATES } from "../src/server/game/seed-data";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("🌱 Seeding Arcane Codex reference data...");

  // Seed Shop Items
  for (const item of INITIAL_SHOP_ITEMS) {
    await prisma.shopItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log(`✓ Seeded ${INITIAL_SHOP_ITEMS.length} shop items.`);

  // Seed Achievements
  for (const achievement of INITIAL_ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }
  console.log(`✓ Seeded ${INITIAL_ACHIEVEMENTS.length} achievements.`);

  // Seed Quest Templates (52 templates)
  for (const template of INITIAL_TEMPLATES) {
    await prisma.questTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }
  console.log(`✓ Seeded ${INITIAL_TEMPLATES.length} quest templates across 5 attributes.`);
}

if (process.argv[1]?.includes("seed")) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
