import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function prismaClientSingleton() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "❌ [Ruka Studio Error]: DATABASE_URL is not defined.\n" +
      "Please configure your PostgreSQL database connection string in your .env file or Google AI Studio Secrets."
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
