import { Role } from '@prisma/client'
import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string,
            role: Role
        }
    }
}