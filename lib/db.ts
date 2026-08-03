import { PrismaClient } from "@prisma/client";

/**
 * Prisma client shared by all server-side code.
 *
 * Next.js dev mode reloads modules often; keeping the client on globalThis
 * prevents opening a new SQLite/Prisma connection on every hot reload.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In production the process is stable, so the singleton does not need to be
// written back to globalThis. In dev this avoids connection churn.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
