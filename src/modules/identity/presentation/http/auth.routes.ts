import { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { authController } from '../../container.js';
import { authenticate } from '../../../../shared/http/middlewares/authenticate.js';

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, { global: false });

  // Rota de login deve ser pública
  fastify.post(
    '/login',
    { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } } },
    authController.login,
  );

  // Rota de logout precisa de autenticação
  fastify.post('/logout', { preHandler: authenticate, handler: authController.logout });

  // NOVO
  fastify.post('/refresh-token', authController.refreshToken);
  fastify.post('/forgot-password', authController.forgotPassword);
  fastify.post('/reset-password', authController.resetPassword);
}
