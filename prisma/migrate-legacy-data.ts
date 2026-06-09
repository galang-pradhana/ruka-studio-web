import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Helper to check if a string is a valid dual-language JSON
function isDualLanguageJson(val: string): boolean {
  try {
    const parsed = JSON.parse(val);
    return (
      parsed &&
      typeof parsed === "object" &&
      "id" in parsed &&
      "en" in parsed
    );
  } catch {
    return false;
  }
}

// Helper to check if a value should be skipped (e.g. URLs, emails, booleans, phone numbers)
function shouldSkipMigration(key: string, val: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  // Skip URLs
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return true;
  // Skip Booleans
  if (trimmed === "true" || trimmed === "false") return true;
  // Skip Emails
  if (trimmed.includes("@") && !trimmed.includes(" ")) return true;
  // Skip whatsappNumber or phone numbers (digits only or starts with +)
  if (key === "whatsappNumber" || /^\+?\d+$/.test(trimmed)) return true;
  
  return false;
}

async function migrateLpContents() {
  console.log("Migrating LP Contents...");
  const contents = await prisma.lpContent.findMany();
  let migratedCount = 0;

  for (const content of contents) {
    const { section, key, value } = content;
    if (!value) continue;

    // Check if it's already JSON or if it should be skipped
    if (isDualLanguageJson(value)) {
      console.log(`[SKIP] [${section}] ${key}: Already dual-language JSON`);
      continue;
    }

    if (shouldSkipMigration(key, value)) {
      console.log(`[SKIP] [${section}] ${key}: Skipped (technical/url/boolean value)`);
      continue;
    }

    // Convert to dual-language JSON format
    const newJson = JSON.stringify({
      id: value.trim(),
      en: value.trim() // Fallback EN to ID value initially
    });

    await prisma.lpContent.update({
      where: {
        id: content.id
      },
      data: {
        value: newJson
      }
    });

    console.log(`[MIGRATED] [${section}] ${key}: Converted to JSON`);
    migratedCount++;
  }

  console.log(`LP Contents migration finished. Total migrated: ${migratedCount}`);
}

async function migratePortfolioItems() {
  console.log("\nMigrating Portfolio Items...");
  const items = await prisma.lpPortfolioItem.findMany();
  let migratedCount = 0;

  for (const item of items) {
    let title = item.title;
    let projectType = item.projectType;
    let description = item.description;
    let updated = false;

    // Migrate Title
    if (title && !isDualLanguageJson(title)) {
      title = JSON.stringify({
        id: title.trim(),
        en: title.trim()
      });
      updated = true;
    }

    // Migrate Project Type
    if (projectType && !isDualLanguageJson(projectType)) {
      projectType = JSON.stringify({
        id: projectType.trim(),
        en: projectType.trim()
      });
      updated = true;
    }

    // Migrate Description
    if (description && !isDualLanguageJson(description)) {
      description = JSON.stringify({
        id: description.trim(),
        en: description.trim()
      });
      updated = true;
    }

    if (updated) {
      await prisma.lpPortfolioItem.update({
        where: { id: item.id },
        data: {
          title,
          projectType,
          description
        }
      });
      console.log(`[MIGRATED] Portfolio Item ID ${item.id}: Converted text fields to JSON`);
      migratedCount++;
    } else {
      console.log(`[SKIP] Portfolio Item ID ${item.id}: Already fully JSON`);
    }
  }

  console.log(`Portfolio Items migration finished. Total migrated: ${migratedCount}`);
}

async function main() {
  await migrateLpContents();
  await migratePortfolioItems();
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
