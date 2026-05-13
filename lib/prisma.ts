// lib/prisma.ts — Prisma 7 singleton for Next.js (Node.js runtime).
// Prisma 7 requires a driver adapter — using @prisma/adapter-pg for standard PostgreSQL.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local");
  }

  // Prisma 7 uses a JS-based engine that requires a driver adapter.
  // PrismaPg wraps the standard `pg` (node-postgres) driver.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Prevent multiple instances during hot-reloading in development.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
