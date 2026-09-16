import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { IJwtProvider } from '../../domain/contracts/IJwtProvider.js';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly hasher: IHasher,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute(rawToken: string): Promise<{ message: string }> {
    try {
      this.jwtProvider.verify(rawToken);
    } catch {
      // Token mal formado: nada a revogar, mas o logout continua idempotente.
      return { message: 'Logout realizado com sucesso!' };
    }

    // TODO(performance): isso compara o token com TODOS os refresh tokens ativos
    // (mesmo comportamento do código original). Para escalar melhor, considere
    // guardar um identificador (jti) junto do hash para localizar o registro em O(1).
    const activeTokens = await this.refreshTokenRepository.findAllActive();
    for (const stored of activeTokens) {
      const matches = await this.hasher.compare(rawToken, stored.tokenHash);
      if (matches) {
        await this.refreshTokenRepository.revoke(stored.id as number);
        break;
      }
    }

    return { message: 'Logout realizado com sucesso!' };
  }
}
