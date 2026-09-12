import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'WAITER']),
});

export const updateUserSchema = z.object({
  name: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'WAITER']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});
