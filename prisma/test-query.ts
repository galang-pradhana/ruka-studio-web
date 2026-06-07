import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.lpPortfolioItem.count();
  console.log("Total LpPortfolioItems:", count);
  const items = await prisma.lpPortfolioItem.findMany();
  console.log("Items:", items);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
