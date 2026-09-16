import { DomainError } from '../../../../shared/domain/DomainError.js';

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Credenciais inválidas') {
    super(message, 401);
  }
}
