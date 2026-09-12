import { FastifyInstance } from 'fastify';
import { userController } from './controller/user.controller.js';
import { authorize } from '../../shared/middlewares/authorization.js';
import { Role } from '@prisma/client';

export async function userRoutes(fastify: FastifyInstance) {
  // All user routes require ADMIN role
  fastify.get('/users', { preHandler: authorize([Role.ADMIN]) }, userController.getAll);
  fastify.get('/users/:id', { preHandler: authorize([Role.ADMIN]) }, userController.getById);
  fastify.post('/users', { preHandler: authorize([Role.ADMIN]) }, userController.create);
  fastify.patch('/users/:id', { preHandler: authorize([Role.ADMIN]) }, userController.update);
  fastify.patch('/users/:id/deactivate', { preHandler: authorize([Role.ADMIN]) }, userController.deactivate);
  fastify.patch('/users/:id/reactivate', { preHandler: authorize([Role.ADMIN]) }, userController.reactivate);
  fastify.patch('/users/:id/password', { preHandler: authorize([Role.ADMIN]) }, userController.changePassword);
  fastify.delete('/users/:id', { preHandler: authorize([Role.ADMIN]) }, userController.delete);
}
