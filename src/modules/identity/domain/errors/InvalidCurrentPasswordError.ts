import { DomainError } from '../../../../shared/domain/DomainError.js';

export class InvalidCurrentPasswordError extends DomainError {
  constructor(message = 'Senha atual incorreta') {
    super(message, 400);
  }
}
