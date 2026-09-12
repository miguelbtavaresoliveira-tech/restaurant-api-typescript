// src/modules/user/routes/user.routes.ts
import { FastifyInstance } from 'fastify';
import { UserController } from './controller/user.controller.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { 
  createUserSchema, 
  updateUserSchema, 
  changePasswordSchema 
} from './schema/user.schema.js';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  // middleware validate work first than controller
  fastify.post(
    '/users', 
    { preHandler: [validate(createUserSchema)] }, 
    userController.create
  );

  fastify.put(
    '/users/:id', 
    { preHandler: [validate(updateUserSchema)] }, 
    userController.update
  );

  fastify.patch(
    '/users/:id/change-password', 
    { preHandler: [validate(changePasswordSchema)] }, 
    userController.changePassword
  );

  fastify.get('/users', userController.getAll);
  fastify.get('/users/:id', userController.getById);
}