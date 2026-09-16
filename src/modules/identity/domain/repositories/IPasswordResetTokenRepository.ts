import { PasswordResetToken } from '../entities/PasswordResetToken.js';

export interface IPasswordResetTokenRepository {
  create(token: PasswordResetToken): Promise<PasswordResetToken>;
  findValidByUserId(userId: number): Promise<PasswordResetToken[]>;
  markUsed(id: number): Promise<void>;
}
