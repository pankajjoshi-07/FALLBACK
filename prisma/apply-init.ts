import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "./seed";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Reading prisma/init.sql...");
  const sqlContent = fs.readFileSync(path.join(process.cwd(), "prisma", "init.sql"), "utf-8");

  // Filter and split SQL statements cleanly
  // Strip BOM if present
  let cleanSql = sqlContent.replace(/^\uFEFF/, "");

  // Remove comment lines
  cleanSql = cleanSql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  // Split on semicolon
  const statements = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} DDL statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await prisma.$executeRawUnsafe(stmt);
      console.log(`[${i + 1}/${statements.length}] Applied statement successfully.`);
    } catch (err: any) {
      // Ignore if table/index already exists
      if (err?.message?.includes("already exists")) {
        console.log(`[${i + 1}/${statements.length}] Already exists, skipping.`);
      } else {
        console.error(`[${i + 1}/${statements.length}] Error executing statement:\n${stmt.substring(0, 100)}...`);
        throw err;
      }
    }
  }

  console.log("✅ All DDL statements applied successfully!");

  console.log("🌱 Now seeding database reference data...");
  await seedDatabase();

  console.log("🚀 Database schema and seed data are ready!");
}

main()
  .catch((err) => {
    console.error("Migration/seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
