import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

/**
 * Singleton Prisma Client — pattern officiel Prisma × Next.js.
 *
 * Le client généré (`prisma-client` generator, output `generated/prisma`) est
 * instancié avec l'adaptateur PostgreSQL (`@prisma/adapter-pg`). Le cache
 * global évite de multiplier les connexions au hot-reload en dev.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL n'est pas définie. Copiez .env.example vers .env et renseignez votre chaîne de connexion PostgreSQL."
    )
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}