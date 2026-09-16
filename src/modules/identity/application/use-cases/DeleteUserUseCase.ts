import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';

/**
 * Antes era um placeholder vazio (deleteUser). Implementado como hard delete.
 * TODO: avalie se não é melhor exigir deactivate() antes de permitir delete,
 * já que vocês têm AuditLog — apagar o usuário pode quebrar o rastro de auditoria
 * de pedidos/comandas que ele criou.
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    await this.userRepository.delete(id);
  }
}
