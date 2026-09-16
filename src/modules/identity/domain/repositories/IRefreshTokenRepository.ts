import { RefreshToken } from '../entities/RefreshToken.js';

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  /** Retorna apenas os tokens ainda não expirados. */
  findAllActive(): Promise<RefreshToken[]>;
  /** No comportamento atual, revogar == apagar o registro. */
  revoke(id: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
