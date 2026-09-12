import bcrypt from 'bcryptjs';
import { prisma } from '../../../shared/lib/prisma.js';
import { FastifyError, fastify } from 'fastify';
import { UpdateUserDto } from '../schema/user.schema.js';
import { UserDto } from '../schema/user.dto.js';

export class UserService {
  // Create user (placeholder, already exists elsewhere)
  async createUser(data: any) {
    // placeholder – implementation not required for current task
  }

  async getAllUsers() {
    // placeholder – implementation not required for current task
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    // map to DTO (omit password)
    const { password, ...rest } = user as any;
    return rest as UserDto;
  }

  /**
   * Deactivate user (logical deletion) and revoke all refresh tokens.
   */
  async deactivateUser(id: string): Promise<UserDto> {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    // revoke tokens
    await prisma.refreshToken.deleteMany({ where: { userId: id } });
    const { password, ...rest } = user as any;
    return rest as UserDto;
  }

  /**
   * Reactivate a previously deactivated user.
   */
  async reactivateUser(id: string): Promise<UserDto> {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
    const { password, ...rest } = user as any;
    return rest as UserDto;
  }

  /**
   * Update user fields. No field will be saved as blank because the Zod schema
   * (updateUserSchema) already validates non‑empty strings and at least one field.
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<UserDto> {
    // Prisma will ignore undefined fields, so we can pass the object directly.
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    const { password, ...rest } = user as any;
    return rest as UserDto;
  }

  /**
   * Change password.
   * If the requester is ADMIN, currentPassword is not required.
   * Otherwise we verify the current password before hashing the new one.
   */
  async changePassword(
    id: string,
    newPassword: string,
    requesterRole: string,
    currentPassword?: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    if (requesterRole !== 'ADMIN') {
      if (!currentPassword) {
        throw new Error('Current password required');
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        throw new Error('Current password is incorrect');
      }
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
  }

  async deleteUser(id: string) {
    // placeholder – implementation not required for current task
  }
}
