import { PrismaClient } from '@prisma/client';

// Padrão "singleton global" — evita abrir várias conexões em dev por causa
// do hot-reload (cada reload recriaria um PrismaClient novo se não fosse isso).
// Esse já era o comportamento do seu shared/lib/prisma.ts original — só mudei
// o local do arquivo, a lógica é a mesma.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
