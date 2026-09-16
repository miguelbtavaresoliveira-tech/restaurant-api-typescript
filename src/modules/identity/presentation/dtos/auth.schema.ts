import { z } from 'zod';

export const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export type LoginBody = z.infer<typeof authBodySchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
