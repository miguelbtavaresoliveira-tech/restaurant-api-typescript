import { Role } from '@prisma/client';
import { z } from 'zod';

// 1. Use enum from prisma
const RoleEnum = z.enum(Role);

// 2. Create user Schema
export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Required user name'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must have at least 6 characters'),
  role: z
    .array(RoleEnum)
    .nonempty('User must have at least one role'),
});

// 3. Update user Schema
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email('Invalid email address').optional(),
    role: RoleEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// 4. Change password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must have at least 6 characters'),
});

// 5. Response Schema (Output DTO)
export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.array(RoleEnum), // standardized as array
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types inferidos a partir dos schemas
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;