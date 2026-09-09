import { formatError } from '../../../shared/utils/errors/formatZodErrors.js';
import { AuthService } from '../services/auth.service.js';
import { authBodySchema, resetPasswordSchema, } from '../schemas/auth.schema.js';
const authService = new AuthService();
export const authController = {
    async login(request, reply) {
        try {
            const result = authBodySchema.safeParse(request.body);
            if (!result.success) {
                return reply.status(400).send({
                    message: "Dados inválidos",
                    errors: formatError(result)
                });
            }
            const email = result.data.email;
            const password = result.data.password;
            const { user, token } = await authService.login({ email, password });
            return reply.status(200).send({ user, token });
        }
        catch (error) {
            if (error.message === "Usuario não encontrado") {
                return reply.status(401).send({ message: "Usuário não encontrado" });
            }
            if (error.message === "Credenciais inválidas") {
                return reply.status(401).send({ message: "Credenciais inválidas" });
            }
            return reply.status(500).send({ message: "Erro interno do servidor" });
        }
    },
    async logout(request, reply) {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer")) {
                return reply.status(401).send({ message: "Token não encontrado" });
            }
            const token = authHeader.split(' ')[1];
            const result = await authService.logout(token);
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(500).send({
                message: "Erro interno do servidor"
            });
        }
    },
    async forgotPassword(request, reply) {
        return reply.status(410).send({ message: "Forgot password endpoint removed" });
    },
    async resetPassword(request, reply) {
        const result = resetPasswordSchema.safeParse(request.body);
        if (!result.success) {
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: formatError(result),
            });
        }
        const { token, newPassword } = result.data;
        try {
            await authService.resetPassword(token, newPassword);
            return reply.send({ message: "Senha atualizada com sucessso" });
        }
        catch (error) {
            return reply.code(400).send({ error: "Token inválido ou expirado" });
        }
    }
};
