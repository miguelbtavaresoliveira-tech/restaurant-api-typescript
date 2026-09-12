import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../service/user.service.js';
import { createUserSchema, updateUserSchema, changePasswordSchema, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../schema/user.schema.js';
import { formatError } from '../../../shared/utils/errors/formatZodErrors.js';
import { FastifyError } from 'fastify';

const userService = new UserService();

export const userController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const result = createUserSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ errors: formatError(result) });
    }
    // Placeholder: actual creation may be elsewhere; respond with created status.
    return reply.status(201).send();
  },

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await userService.getAllUsers();
    return reply.send(users);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const user = await userService.getUserById(id);
      return reply.send(user);
    } catch (e) {
      return reply.status(404).send({ message: (e as Error).message });
    }
  },

  async update(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = updateUserSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ errors: formatError(result) });
    }
    try {
      const updated = await userService.updateUser(id, result.data as UpdateUserDto);
      return reply.send(updated);
    } catch (e) {
      return reply.status(404).send({ message: (e as Error).message });
    }
  },

  async deactivate(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const user = await userService.deactivateUser(id);
      return reply.send(user);
    } catch (e) {
      return reply.status(404).send({ message: (e as Error).message });
    }
  },

  async reactivate(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    try {
      const user = await userService.reactivateUser(id);
      return reply.send(user);
    } catch (e) {
      return reply.status(404).send({ message: (e as Error).message });
    }
  },

  async changePassword(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = changePasswordSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ errors: formatError(result) });
    }
    // requester role is in request.user (set by auth middleware)
    const requester = (request as any).user as { role: string };
    try {
      await userService.changePassword(id, result.data.newPassword, requester.role, result.data.currentPassword);
      return reply.send({ message: 'Password updated successfully' });
    } catch (e) {
      const status = (e as Error).message.includes('not found') ? 404 : 400;
      return reply.status(status).send({ message: (e as Error).message });
    }
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    // Placeholder: delete logic not required for current task
    return reply.send();
  },
};
