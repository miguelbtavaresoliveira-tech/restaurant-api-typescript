import { DomainError } from '../../../../shared/domain/DomainError.js';

export class InvalidEmailError extends DomainError {
  constructor(raw: string) {
    super(`E-mail inválido: ${raw}`, 400);
  }
}
