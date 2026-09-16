import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { toUserOutput, type UserOutput } from '../dtos/UserDtos.js';

/** Antes era um placeholder vazio (getAllUsers). Implementado por completo aqui. */
export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map(toUserOutput);
  }
}
