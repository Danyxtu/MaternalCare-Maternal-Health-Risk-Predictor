import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import { DATABASE_URL } from "../config/db.js";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Standard connection pool
const pool = new Pool({ connectionString: DATABASE_URL });

// Prisma Adapter
const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter,
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
