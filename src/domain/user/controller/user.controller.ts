import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../service/user.service.js';
import { createUserSchema, updateUserSchema } from '../schema/user.schema.js';
import { formatError } from '../../../shared/utils/errors/formatZodErrors.js';

const userService = new UserService();

export const userController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    // TODO: implement create user logic
    return reply.status(201).send();
  },

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    // TODO: implement get all users logic
    return reply.send();
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    // TODO: implement get user by id logic
    return reply.send();
  },

  async update(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    // TODO: implement update user logic
    return reply.send();
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    // TODO: implement delete user logic
    return reply.send();
  },
};
