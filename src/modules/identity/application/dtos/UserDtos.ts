import { User } from '../../domain/entities/User.js';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  roles?: string[];
}

export interface ChangePasswordInput {
  userId: number;
  newPassword: string;
  currentPassword?: string;
  requesterIsAdmin: boolean;
}

export interface UserOutput {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id as number,
    name: user.name,
    email: user.email.value,
    roles: user.roles.values,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
