import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { toUserOutput, type UserOutput } from '../dtos/UserDtos.js';

export class ReactivateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    user.reactivate();
    const updated = await this.userRepository.update(user);
    return toUserOutput(updated);
  }
}
