import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { toUserOutput, type UserOutput } from '../dtos/UserDtos.js';

export class DeactivateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(id: number): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    user.deactivate();
    const updated = await this.userRepository.update(user);

    // Mesma regra do original: desativar revoga todas as sessões (refresh tokens).
    await this.refreshTokenRepository.deleteAllByUserId(id);

    return toUserOutput(updated);
  }
}
