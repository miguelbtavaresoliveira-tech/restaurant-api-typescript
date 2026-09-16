import { Entity } from '../../../../shared/domain/Entity.js';

export interface PasswordResetTokenProps {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
}

export class PasswordResetToken extends Entity<PasswordResetTokenProps> {
  private constructor(props: PasswordResetTokenProps, id: number) {
    super(props, id);
  }

  static create(props: PasswordResetTokenProps, id: number): PasswordResetToken {
    return new PasswordResetToken(props, id);
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

  isUsed(): boolean {
    return !!this.props.usedAt;
  }

  isValid(now: Date = new Date()): boolean {
    return !this.isExpired(now) && !this.isUsed();
  }

  markUsed(): void {
    this.props.usedAt = new Date();
  }
}
