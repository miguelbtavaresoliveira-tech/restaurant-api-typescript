import type { User as PrismaUser } from '@prisma/client';
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
    return {
      name: user.name,
      email: user.email.value,
      password: user.passwordHash,
      role: user.roles.values,
      isActive: user.isActive,
    };
  }
}
