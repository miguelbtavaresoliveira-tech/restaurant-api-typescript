import { z } from 'zod';
import { RoleName } from '../../domain/value-objects/Role.js';

const RoleEnum = z.nativeEnum(RoleName);

// Mantive o nome do campo como `role` (igual ao original / coluna do Prisma),
// mesmo sendo um array — é só pra não quebrar o contrato HTTP existente.
export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Required user name'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  role: z.array(RoleEnum).nonempty('User must have at least one role'),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email('Invalid email address').optional(),
    // Original tinha `role: RoleEnum.optional()` (um valor só) — padronizei
    // como array pra bater com createUserSchema e com o entity Roles.
    role: z.array(RoleEnum).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string().min(6, 'New password must have at least 6 characters'),
});

export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.array(RoleEnum),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;
