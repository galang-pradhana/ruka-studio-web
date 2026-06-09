import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== LP CONTENTS ===");
  const lpContents = await prisma.lpContent.findMany({
    orderBy: [{ section: "asc" }, { key: "asc" }]
  });
  lpContents.forEach(item => {
    console.log(`[${item.section}] ${item.key}: ${item.value}`);
  });

  console.log("\n=== PORTFOLIO ITEMS ===");
  const portfolioItems = await prisma.lpPortfolioItem.findMany({
    orderBy: { orderIndex: "asc" }
  });
  portfolioItems.forEach(item => {
    console.log(`ID: ${item.id}\nTitle: ${item.title}\nType: ${item.projectType}\nDesc: ${item.description}\nImages: ${item.detailImagesJson}\n`);
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
