import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanExpiredTokens } from './cleanExpiredTokens.js';
import { prismaMock } from '@/shared/testing/prisma.mock.js';
vi.mock('@/shared/lib/prisma.js', async () => {
    const { prismaMock } = await import('@/shared/testing/prisma.mock.js');
    return { prisma: prismaMock };
});
describe('cleanExpiredTokens', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should call prisma.refreshToken.deleteMany with the correct where clause', async () => {
        prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
        await cleanExpiredTokens();
        expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
            where: {
                expiresAt: {
                    lt: expect.any(Date),
                },
            },
        });
    });
    it('should return without error when no tokens are expired', async () => {
        prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
        await expect(cleanExpiredTokens()).resolves.toBeUndefined();
    });
    it('should return without error when some tokens are expired and deleted', async () => {
        prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 5 });
        await expect(cleanExpiredTokens()).resolves.toBeUndefined();
    });
});
