import { prisma } from '../../shared/lib/prisma.js';

/**
 * Deletes all refresh tokens that have expired.
 */
export async function cleanExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });
}
