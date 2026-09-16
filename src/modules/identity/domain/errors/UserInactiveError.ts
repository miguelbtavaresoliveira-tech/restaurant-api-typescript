import { DomainError } from '../../../../shared/domain/DomainError.js';

export class UserInactiveError extends DomainError {
  constructor() {
    super('Usuário desativado, login negado', 403);
  }
}
