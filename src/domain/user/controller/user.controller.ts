import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '@prisma/client';
import { UserService } from '../service/user.service.js';
import { 
  type CreateUserDto, 
  type UpdateUserDto, 
  type ChangePasswordDto 
} from '../schema/user.schema.js';

interface AuthenticatedUser {
  id: number;
  role: Role;
}

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as CreateUserDto;
    const newUser = await this.userService.createUser(body);
    return reply.status(201).send(newUser);
  };

  getAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await this.userService.getAllUsers();
    return reply.send(users);
  };

  getById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    const user = await this.userService.getUserById(userId);
    return reply.send(user);
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    const body = request.body as UpdateUserDto;
    const updated = await this.userService.updateUser(userId, body);
    return reply.send(updated);
  };

  deactivate = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    const user = await this.userService.deactivateUser(userId);
    return reply.send(user);
  };

  reactivate = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    const user = await this.userService.reactivateUser(userId);
    return reply.send(user);
  };

  changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    const body = request.body as ChangePasswordDto;
    const requester = (request as FastifyRequest & { user: AuthenticatedUser }).user;

    await this.userService.changePassword(
      userId,
      body.newPassword,
      requester.role,
      body.currentPassword
    );

    return reply.send({ message: 'Password updated successfully' });
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = Number(id);

    if (isNaN(userId)) {
      return reply.status(400).send({ message: 'Invalid ID format' });
    }

    await this.userService.deleteUser(userId);
    return reply.status(204).send();
  };
}