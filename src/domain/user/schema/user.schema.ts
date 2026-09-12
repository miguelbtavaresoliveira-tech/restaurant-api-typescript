import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'WAITER', 'KITCHEN', 'CUSTOMER']),
});

export const updateUserSchema = z.object({
  name: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'WAITER', 'KITCHEN', 'CUSTOMER']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8),
});

// Types inferred from schemas
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
