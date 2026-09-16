import { DomainError } from '../../../../shared/domain/DomainError.js';

export class UserNotFoundError extends DomainError {
  constructor(id?: number | string) {
    super(id !== undefined ? `Usuário ${id} não encontrado` : 'Usuário não encontrado', 404);
  }
}
