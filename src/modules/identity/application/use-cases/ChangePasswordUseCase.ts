import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { InvalidCurrentPasswordError } from '../../domain/errors/InvalidCurrentPasswordError.js';
import type { ChangePasswordInput } from '../dtos/UserDtos.js';

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new UserNotFoundError(input.userId);

    // Mesma regra do original: ADMIN pode trocar sem informar a senha atual.
    if (!input.requesterIsAdmin) {
      if (!input.currentPassword) {
        throw new InvalidCurrentPasswordError('Senha atual é obrigatória');
      }
      const valid = await this.hasher.compare(input.currentPassword, user.passwordHash);
      if (!valid) {
        throw new InvalidCurrentPasswordError();
      }
    }

    const newHash = await this.hasher.hash(input.newPassword);
    user.changePassword(newHash);
    await this.userRepository.update(user);
  }
}
