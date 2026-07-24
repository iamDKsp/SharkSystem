import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ 
    adapter: new PrismaPg(new Pool({ 
      connectionString,
      ssl: isLocalhost ? false : (process.env.NODE_ENV === "production" ? undefined : { rejectUnauthorized: false })
    })) 
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
