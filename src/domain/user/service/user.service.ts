import bcrypt from 'bcryptjs';
import { prisma } from '../../../shared/lib/prisma.js';
import { FastifyError, fastify } from 'fastify';
import { UpdateUserDto } from '../schema/user.schema.js';
import { userResponseSchema, type UserResponseDto } from '../schema/user.schema.js'
import { Role } from '@prisma/client';

export class UserService {

  private userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updateAt: true,
  }

  // Create user (placeholder, already exists elsewhere)
  async createUser(data: any) {
    // placeholder – implementation not required for current task
  }

  async getAllUsers() {
    // placeholder – implementation not required for current task
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({ 
      where: { id },
      select: this.userSelect,
    });
    if (!user) {
      throw new Error('User not found');
    }

    // map to DTO (omit password)
    const userDto: UserResponseDto = userResponseSchema.parse(user)
    return userDto
  }

  /**
   * Deactivate user (logical deletion) and revoke all refresh tokens.
   */
  async deactivateUser(id: number): Promise<UserResponseDto> {

    //verify existence
    const userExist = await prisma.user.findUnique({ where: { id } })
    if(!userExist) throw new Error('User not found')

    // executed desativation and revoke with only transaction for consistence
    const [updateuser] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { isActive: false },
        select: this.userSelect,
      }),
      prisma.refreshToken.deleteMany({ where:{ userId: id } })
    ])

    const userDto: UserResponseDto = userResponseSchema.parse(updateuser)
    return userDto
  }

  /**
   * Reactivate a previously deactivated user.
   */
  async reactivateUser(id: number): Promise<UserResponseDto> {
    const userExist = await prisma.user.findUnique({ where: { id }})
    if(!userExist) throw new Error('User not found')

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: this.userSelect,
    });
    const userDto: UserResponseDto = userResponseSchema.parse(user)
    return userDto
  }

  /**
   * Update user fields. No field will be saved as blank because the Zod schema
   * (updateUserSchema) already validates non‑empty strings and at least one field.
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    // Prisma will ignore undefined fields, so we can pass the object directly.
    const userExist = await prisma.user.findUnique({ where: { id }})
    if(!userExist) throw new Error('User not found')

    const user = await prisma.user.update({
      where: { id },
      data,
      select: this.userSelect
    });
    const userDto: UserResponseDto = userResponseSchema.parse(user)
    return userDto
  }

  /**
   * Change password.
   * If the requester is ADMIN, currentPassword is not required.
   * Otherwise we verify the current password before hashing the new one.
   */
  async changePassword(
    id: number,
    newPassword: string,
    requesterRole: Role,
    currentPassword?: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    
    // when user not be admin, needed confim currentPassword
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

  async deleteUser(id: number) {
    // placeholder – implementation not required for now times
  }
}
