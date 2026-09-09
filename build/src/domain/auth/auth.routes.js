import { authController } from './controllers/auth.controller.js';
import { authenticate } from '../../shared/middlewares/authenticate.js';
import fastifyRateLimit from '@fastify/rate-limit';
export async function authRoutes(fastify) {
    await fastify.register(fastifyRateLimit, { global: false });
    // Rota de login deve ser pública
    fastify.post("/login", {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '15 minutes'
            }
        }
    }, authController.login);
    // Rota de logout precisa authenticação
    fastify.post("/logout", {
        preHandler: authenticate,
        handler: authController.logout,
    });
}
