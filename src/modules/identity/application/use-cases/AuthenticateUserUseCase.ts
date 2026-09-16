import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { IJwtProvider } from '../../domain/contracts/IJwtProvider.js';
import { Email } from '../../domain/value-objects/Email.js';
import { RefreshToken } from '../../domain/entities/RefreshToken.js';
import { InvalidCredentialsError } from '../../domain/errors/InvalidCredentialsError.js';
import type { AuthenticateInput, AuthenticateOutput } from '../dtos/AuthDtos.js';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly hasher: IHasher,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute({ email, password }: AuthenticateInput): Promise<AuthenticateOutput> {
    let emailVo: Email;
    try {
      emailVo = Email.create(email);
    } catch {
      // Não diferenciamos "email inválido" de "credenciais inválidas" pra fora:
      // isso evita dar dica de que um e-mail existe ou não.
      throw new InvalidCredentialsError();
    }

    const user = await this.userRepository.findByEmail(emailVo);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    user.assertCanAuthenticate();

    const passwordMatches = await this.hasher.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const payload = { id: user.id as number, roles: user.roles.values };
    const token = this.jwtProvider.signAccessToken(payload);
    const rawRefreshToken = this.jwtProvider.signRefreshToken(payload);
    const refreshTokenHash = await this.hasher.hash(rawRefreshToken);

    const refreshToken = RefreshToken.create(
      {
        userId: user.id as number,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
      0, // id é gerado pelo banco em PrismaRefreshTokenRepository.create
    );

    await this.refreshTokenRepository.create(refreshToken);

    return {
      user: {
        id: user.id as number,
        name: user.name,
        email: user.email.value,
        roles: user.roles.values,
      },
      token,
      refreshToken: rawRefreshToken,
    };
  }
}
