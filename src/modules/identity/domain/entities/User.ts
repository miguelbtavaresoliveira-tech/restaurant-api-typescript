import { AggregateRoot } from '../../../../shared/domain/AggregateRoot.js';
import { Email } from '../value-objects/Email.js';
import { Roles } from '../value-objects/Role.js';
import { UserInactiveError } from '../errors/UserInactiveError.js';
import { UserPasswordChangedEvent } from '../events/UserPasswordChangedEvent.js';
import { UserStatusChangedEvent } from '../events/UserStatusChangedEvent.js';

export interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
  roles: Roles;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  name: string;
  email: Email;
  passwordHash: string;
  roles: Roles;
  isActive?: boolean;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id: number) {
    super(props, id);
  }

  /** Cria um usuário novo (regras de criação aplicadas aqui). */
  static create(props: CreateUserProps, id: number): User {
    const now = new Date();
    return new User(
      {
        ...props,
        isActive: props.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  /** Reidrata a entidade a partir de dados já persistidos (usado pelo mapper). */
  static reconstitute(props: UserProps, id: number): User {
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get roles(): Roles {
    return this.props.roles;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    this.props.name = name;
    this.touch();
  }

  changeEmail(email: Email): void {
    this.props.email = email;
    this.touch();
  }

  changeRoles(roles: Roles): void {
    this.props.roles = roles;
    this.touch();
  }

  /** Regra de negócio: só é possível autenticar se o usuário estiver ativo. */
  assertCanAuthenticate(): void {
    if (!this.props.isActive) {
      throw new UserInactiveError();
    }
  }

  /** Recebe o hash já pronto — o hashing em si é responsabilidade da infraestrutura (IHasher). */
  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.touch();
    this.addDomainEvent(new UserPasswordChangedEvent(this.id as number));
  }

  deactivate(): void {
    if (!this.props.isActive) return;
    this.props.isActive = false;
    this.touch();
    this.addDomainEvent(new UserStatusChangedEvent(this.id as number, false));
  }

  reactivate(): void {
    if (this.props.isActive) return;
    this.props.isActive = true;
    this.touch();
    this.addDomainEvent(new UserStatusChangedEvent(this.id as number, true));
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
