import { z } from 'zod';
export default {};
const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres"),
});
const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
const resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(6),
});
export { authBodySchema, forgotPasswordSchema, resetPasswordSchema, };
