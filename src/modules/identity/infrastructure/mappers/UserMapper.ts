import type { User as PrismaUser, Role } from '@prisma/client';
import { User } from '../../domain/entities/User.js';
import { Email } from '../../domain/value-objects/Email.js';
import { Roles, RoleName } from '../../domain/value-objects/Role.js';

export class UserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.reconstitute(
      {
        name: raw.name,
        email: Email.create(raw.email),
        passwordHash: raw.password,
        roles: Roles.create(raw.role as unknown as RoleName[]),
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  static toPersistence(user: User) {
    // Prisma armazena role como enum único; usamos a primeira (mais privilegiada) role do domínio.
    const primaryRole = user.roles.values[0] as unknown as Role;
    return {
      name: user.name,
      email: user.email.value,
      password: user.passwordHash,
      role: primaryRole,
      isActive: user.isActive,
    };
  }
}
