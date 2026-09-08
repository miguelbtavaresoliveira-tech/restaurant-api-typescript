import { FastifyInstance } from "fastify";
import { authController } from './controllers/auth.controller.js'
import { authenticate } from '../../shared/middlewares/authenticate.js'
import fastifyRateLimit from '@fastify/rate-limit';


export async function authRoutes(fastify: FastifyInstance) {

    await fastify.register(fastifyRateLimit, { global: false });

    // Rota de login deve ser pública
    fastify.post("/login",{
        config: {
            rateLimit:{
                max: 10,
                timeWindow: '15 minutes'
            }
        }
    }, authController.login)

    fastify.post("/forgot-password", authController.forgotPassword)

    fastify.post("/reset-password", authController.resetPassword)

    // Rota de logout precisa authenticação
    fastify.post("/logout", {
        preHandler: authenticate,
        handler: authController.logout,
    })
}
