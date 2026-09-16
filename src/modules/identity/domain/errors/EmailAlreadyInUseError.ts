import { DomainError } from '../../../../shared/domain/DomainError.js';

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`O e-mail ${email} já está em uso`, 409);
  }
}
