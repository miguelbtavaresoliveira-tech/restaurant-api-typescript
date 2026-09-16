import { FastifyInstance } from 'fastify';
import { userController } from '../../container.js';
import { authenticate } from '../../../../shared/http/middlewares/authenticate.js';
import { validate } from '../../../../shared/http/middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema, changePasswordSchema } from '../dtos/user.schema.js';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/users', { preHandler: [validate(createUserSchema)] }, userController.create);

  fastify.put(
    '/users/:id',
    { preHandler: [authenticate, validate(updateUserSchema)] },
    userController.update,
  );

  fastify.patch(
    '/users/:id/change-password',
    { preHandler: [authenticate, validate(changePasswordSchema)] },
    userController.changePassword,
  );

  fastify.get('/users', { preHandler: [authenticate] }, userController.getAll);
  fastify.get('/users/:id', { preHandler: [authenticate] }, userController.getById);
  fastify.patch('/users/:id/deactivate', { preHandler: [authenticate] }, userController.deactivate);
  fastify.patch('/users/:id/reactivate', { preHandler: [authenticate] }, userController.reactivate);
  fastify.delete('/users/:id', { preHandler: [authenticate] }, userController.delete);
}
