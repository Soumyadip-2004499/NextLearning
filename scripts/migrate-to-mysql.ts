/**
 * NextLearning Database Migration Utility: SQLite to MySQL
 * 
 * Usage:
 * 1. Set your MySQL credentials in .env:
 *    MYSQL_URL="mysql://root:YOUR_PASSWORD@localhost:3306/nextlearning"
 * 2. Run:
 *    npx tsx scripts/migrate-to-mysql.ts
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function main() {
  console.log("=======================================================");
  console.log("🐬 NextLearning MySQL Backend Migration Tool");
  console.log("=======================================================\n");

  const mysqlUrl =
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL_MYSQL ||
    "mysql://root:root@localhost:3306/nextlearning";

  console.log(`Target MySQL Database: ${mysqlUrl.replace(/:[^:@]+@/, ":****@")}\n`);

  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const schemaBackup = path.join(process.cwd(), "prisma", "schema.prisma.sqlite.bak");

  if (!fs.existsSync(schemaBackup)) {
    fs.copyFileSync(schemaPath, schemaBackup);
    console.log("📁 Backed up SQLite Prisma schema to schema.prisma.sqlite.bak");
  }

  // Read current schema and replace provider
  let schemaContent = fs.readFileSync(schemaPath, "utf-8");
  schemaContent = schemaContent.replace(
    /datasource db\s*\{\s*provider\s*=\s*"sqlite"/g,
    'datasource db {\n  provider = "mysql"'
  );

  fs.writeFileSync(schemaPath, schemaContent, "utf-8");
  console.log("🔄 Configured Prisma schema datasource provider to 'mysql'.");

  console.log("\n📦 Pushing Prisma schema to MySQL database...");
  try {
    execSync(`npx prisma db push --accept-data-loss`, {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: mysqlUrl,
      },
    });

    console.log("\n🌱 Seeding initial NextLearning data into MySQL...");
    execSync(`npx tsx prisma/seed.ts`, {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: mysqlUrl,
      },
    });

    console.log("\n🎉 MySQL MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("To keep using MySQL as your primary database:");
    console.log(`Update your .env file: DATABASE_URL="${mysqlUrl}"`);
  } catch (error: any) {
    console.error("\n❌ Migration to MySQL failed:", error?.message || error);
    console.log("\nRestoring SQLite schema backup...");
    if (fs.existsSync(schemaBackup)) {
      fs.copyFileSync(schemaBackup, schemaPath);
    }
    console.log("SQLite schema restored. NextLearning remains fully functional on SQLite.");
  }
}

main().catch(console.error);
