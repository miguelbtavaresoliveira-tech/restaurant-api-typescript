import { ValueObject } from '../../../../shared/domain/ValueObject.js';

// Espelha o enum Role do Prisma, mas mantém o domínio independente da lib do ORM.
// Se o enum do Prisma mudar, atualize aqui e no UserMapper.
export enum RoleName {
  ADMIN = 'ADMIN',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
  CUSTOMER = 'CUSTOMER',
}

interface RolesProps {
  values: RoleName[];
}

export class Roles extends ValueObject<RolesProps> {
  private constructor(props: RolesProps) {
    super(props);
  }

  static create(roles: RoleName[]): Roles {
    if (!roles || roles.length === 0) {
      throw new Error('Usuário precisa ter ao menos uma role');
    }
    return new Roles({ values: Array.from(new Set(roles)) });
  }

  get values(): RoleName[] {
    return [...this.props.values];
  }

  has(role: RoleName): boolean {
    return this.props.values.includes(role);
  }

  isAdmin(): boolean {
    return this.has(RoleName.ADMIN);
  }
}
