import { prisma } from '../infrastructure/database/prisma.js';

/**
 * Deleta todos os refresh tokens que já expiraram.
 */
export async function cleanExpiredTokens(): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
