import { ValueObject } from '../../../../shared/domain/ValueObject.js';
import { InvalidEmailError } from '../errors/InvalidEmailError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(raw: string): Email {
    const value = raw?.trim().toLowerCase();
    if (!value || !EMAIL_REGEX.test(value)) {
      throw new InvalidEmailError(raw);
    }
    return new Email({ value });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
