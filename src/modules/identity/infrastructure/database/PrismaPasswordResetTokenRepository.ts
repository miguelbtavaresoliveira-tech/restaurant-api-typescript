import { PrismaClient } from '@prisma/client';
import { IPasswordResetTokenRepository } from '../../domain/repositories/IPasswordResetTokenRepository.js';
import { PasswordResetToken } from '../../domain/entities/PasswordResetToken.js';

/**
 * IMPORTANTE: este repositório assume um model novo no schema.prisma
 * que ainda não existe no seu projeto. Adicione algo como:
 *
 *   model PasswordResetToken {
 *     id        Int       @id @default(autoincrement())
 *     userId    Int
 *     tokenHash String
 *     expiresAt DateTime
 *     usedAt    DateTime?
 *     user      User      @relation(fields: [userId], references: [id])
 *   }
 *
 * e rode `prisma migrate dev` antes de usar o fluxo de reset de senha.
 */
export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    const created = await this.prisma.passwordResetToken.create({
      data: { userId: token.userId, tokenHash: token.tokenHash, expiresAt: token.expiresAt },
    });
    return PasswordResetToken.create(
      { userId: created.userId, tokenHash: created.tokenHash, expiresAt: created.expiresAt, usedAt: created.usedAt },
      created.id,
    );
  }

  async findValidByUserId(userId: number): Promise<PasswordResetToken[]> {
    const rows = await this.prisma.passwordResetToken.findMany({
      where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    });
    return rows.map((r) =>
      PasswordResetToken.create({ userId: r.userId, tokenHash: r.tokenHash, expiresAt: r.expiresAt, usedAt: r.usedAt }, r.id),
    );
  }

  async markUsed(id: number): Promise<void> {
    await this.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  }
}
