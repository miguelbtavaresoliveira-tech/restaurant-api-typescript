import { Entity } from '../../../../shared/domain/Entity.js';

export interface RefreshTokenProps {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  private constructor(props: RefreshTokenProps, id: number) {
    super(props, id);
  }

  static create(props: RefreshTokenProps, id: number): RefreshToken {
    return new RefreshToken(props, id);
  }

  get userId(): number {
    return this.props.userId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  isExpired(now: Date = new Date()): boolean {
    return now.getTime() > this.props.expiresAt.getTime();
  }

  /**
   * Hoje "revogado" == "deletado do banco" (mesmo comportamento do código original).
   * Se no futuro vocês passarem a marcar `revokedAt` em vez de deletar, adicione
   * o campo aqui e ajuste isValid().
   */
  isValid(now: Date = new Date()): boolean {
    return !this.isExpired(now);
  }
}
