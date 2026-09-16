import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IPasswordResetTokenRepository } from '../../domain/repositories/IPasswordResetTokenRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { IJwtProvider } from '../../domain/contracts/IJwtProvider.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { PasswordResetToken } from '../../domain/entities/PasswordResetToken.js';

/** NOVO — completa o fluxo iniciado em RequestPasswordResetUseCase. */
export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
    private readonly hasher: IHasher,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute(rawToken: string, newPassword: string): Promise<void> {
    const payload = this.jwtProvider.verifyPasswordResetToken(rawToken); // lança se expirado/inválido

    const candidates = await this.resetTokenRepository.findValidByUserId(payload.id);
    let matched: PasswordResetToken | null = null;
    for (const candidate of candidates) {
      if (await this.hasher.compare(rawToken, candidate.tokenHash)) {
        matched = candidate;
        break;
      }
    }

    if (!matched) {
      throw new Error('Token inválido ou expirado');
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user) throw new UserNotFoundError(payload.id);

    const newHash = await this.hasher.hash(newPassword);
    user.changePassword(newHash);

    await this.userRepository.update(user);
    await this.resetTokenRepository.markUsed(matched.id as number);
  }
}
