import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodSchema } from 'zod'
import { formatError } from '../utils/errors/formatZodErrors.js'

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const result = schema.safeParse(request[target])

        if(!result.success) {
            return reply.status(400).send({
                errors: formatError(result),
            })
        }

        request[target] = result.data
    }
}