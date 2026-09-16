import { PrismaClient } from '@prisma/client';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository.js';
import { RefreshToken } from '../../domain/entities/RefreshToken.js';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(token: RefreshToken): Promise<RefreshToken> {
    const created = await this.prisma.refreshToken.create({
      data: { userId: token.userId, tokenHash: token.tokenHash, expiresAt: token.expiresAt },
    });
    return RefreshToken.create(
      { userId: created.userId, tokenHash: created.tokenHash, expiresAt: created.expiresAt },
      created.id,
    );
  }

  async findAllActive(): Promise<RefreshToken[]> {
    const rows = await this.prisma.refreshToken.findMany();
    return rows
      .map((r) => RefreshToken.create({ userId: r.userId, tokenHash: r.tokenHash, expiresAt: r.expiresAt }, r.id))
      .filter((t) => t.isValid());
  }

  async revoke(id: number): Promise<void> {
    // Comportamento original: revogar == deletar o registro do banco.
    await this.prisma.refreshToken.delete({ where: { id } }).catch(() => undefined);
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
