import { FastifyRequest, FastifyReply } from 'fastify';
import { DomainError } from '../../../../shared/domain/DomainError.js';
import { formatError } from '../../../../shared/http/errors/formatZodErrors.js';
import {
  authBodySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordBody,
  type ResetPasswordBody,
} from '../dtos/auth.schema.js';
import { AuthenticateUserUseCase } from '../../application/use-cases/AuthenticateUserUseCase.js';
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase.js';
import { RequestPasswordResetUseCase } from '../../application/use-cases/RequestPasswordResetUseCase.js';
import { ResetPasswordUseCase } from '../../application/use-cases/ResetPasswordUseCase.js';

export class AuthController {
  constructor(
    private readonly authenticateUseCase: AuthenticateUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  private handleError(error: unknown, reply: FastifyReply, fallbackStatus = 400) {
    if (error instanceof DomainError) {
      return reply.status(error.status).send({ message: error.message });
    }
    return reply.status(fallbackStatus === 400 ? 500 : fallbackStatus).send({ message: 'Erro interno do servidor' });
  }

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = authBodySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: 'Dados inválidos', errors: formatError(result) });
    }

    try {
      const output = await this.authenticateUseCase.execute(result.data);
      return reply.status(200).send(output);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return reply.status(401).send({ message: 'Token não encontrado' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const result = await this.logoutUseCase.execute(token);
      return reply.status(200).send(result);
    } catch {
      return reply.status(500).send({ message: 'Erro interno do servidor' });
    }
  };

  // NOVO — rota ainda não existia; já registrada em auth.routes.ts (POST /refresh-token)
  refreshToken = async (request: FastifyRequest<{ Body: { refreshToken?: string } }>, reply: FastifyReply) => {
    const refreshToken = request.body?.refreshToken;
    if (!refreshToken) {
      return reply.status(400).send({ message: 'refreshToken é obrigatório' });
    }

    try {
      const result = await this.refreshTokenUseCase.execute(refreshToken);
      return reply.status(200).send(result);
    } catch (error) {
      return this.handleError(error, reply, 401);
    }
  };

  // Reativado — no original retornava 410 Gone direto.
  forgotPassword = async (request: FastifyRequest<{ Body: ForgotPasswordBody }>, reply: FastifyReply) => {
    const result = forgotPasswordSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: 'Dados inválidos', errors: formatError(result) });
    }

    await this.requestPasswordResetUseCase.execute(result.data.email);
    // Resposta sempre igual, exista ou não o e-mail — evita enumeração de usuários.
    return reply.status(200).send({ message: 'Se o e-mail existir, enviaremos instruções de redefinição.' });
  };

  resetPassword = async (request: FastifyRequest<{ Body: ResetPasswordBody }>, reply: FastifyReply) => {
    const result = resetPasswordSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ message: 'Dados inválidos', errors: formatError(result) });
    }

    try {
      await this.resetPasswordUseCase.execute(result.data.token, result.data.newPassword);
      return reply.send({ message: 'Senha atualizada com sucesso' });
    } catch {
      return reply.status(400).send({ message: 'Token inválido ou expirado' });
    }
  };
}
