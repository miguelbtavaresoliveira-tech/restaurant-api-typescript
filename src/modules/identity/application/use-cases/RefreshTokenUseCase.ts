import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { IJwtProvider } from '../../domain/contracts/IJwtProvider.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { InvalidCredentialsError } from '../../domain/errors/InvalidCredentialsError.js';

/**
 * NOVO — não existia no código original (só havia login/logout).
 * Permite trocar um refresh token válido por um novo access token,
 * sem pedir email/senha de novo. Falta ligar isso a uma rota
 * (já deixei `POST /refresh-token` pronta em auth.routes.ts).
 */
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly hasher: IHasher,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute(rawRefreshToken: string): Promise<{ token: string }> {
    const payload = this.jwtProvider.verify(rawRefreshToken); // lança se inválido/expirado

    const activeTokens = await this.refreshTokenRepository.findAllActive();
    let matched = null;
    for (const stored of activeTokens) {
      if (stored.userId !== payload.id) continue;
      if (await this.hasher.compare(rawRefreshToken, stored.tokenHash)) {
        matched = stored;
        break;
      }
    }

    if (!matched) {
      throw new InvalidCredentialsError('Refresh token inválido ou expirado');
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user) throw new UserNotFoundError(payload.id);

    const token = this.jwtProvider.signAccessToken({ id: user.id as number, roles: user.roles.values });
    return { token };
  }
}
