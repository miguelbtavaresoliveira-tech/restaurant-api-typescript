import { FastifyRequest, FastifyReply } from 'fastify';
import { DomainError } from '../../../../shared/domain/DomainError.js';
import { RoleName } from '../../domain/value-objects/Role.js';
import type { CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../dtos/user.schema.js';
import { RegisterStaffUseCase } from '../../application/use-cases/RegisterStaffUseCase.js';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase.js';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase.js';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase.js';
import { DeactivateUserUseCase } from '../../application/use-cases/DeactivateUserUseCase.js';
import { ReactivateUserUseCase } from '../../application/use-cases/ReactivateUserUseCase.js';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase.js';
import { DeleteUserUseCase } from '../../application/use-cases/DeleteUserUseCase.js';

interface AuthenticatedUser {
  id: number;
  roles: RoleName[];
}

export class UserController {
  constructor(
    private readonly registerStaffUseCase: RegisterStaffUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly reactivateUserUseCase: ReactivateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  private parseId(request: FastifyRequest, reply: FastifyReply): number | null {
    const { id } = request.params as { id: string };
    const userId = Number(id);
    if (isNaN(userId)) {
      reply.status(400).send({ message: 'Invalid ID format' });
      return null;
    }
    return userId;
  }

  private handleError(error: unknown, reply: FastifyReply) {
    if (error instanceof DomainError) {
      return reply.status(error.status).send({ message: error.message });
    }
    return reply.status(500).send({ message: 'Erro interno do servidor' });
  }

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as CreateUserDto;
      const newUser = await this.registerStaffUseCase.execute({
        name: body.name,
        email: body.email,
        password: body.password,
        roles: body.role,
      });
      return reply.status(201).send(newUser);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  getAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await this.listUsersUseCase.execute();
    return reply.send(users);
  };

  getById = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    try {
      const user = await this.getUserByIdUseCase.execute(userId);
      return reply.send(user);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    try {
      const body = request.body as UpdateUserDto;
      const updated = await this.updateUserUseCase.execute(userId, {
        name: body.name,
        email: body.email,
        roles: body.role,
      });
      return reply.send(updated);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  deactivate = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    try {
      const user = await this.deactivateUserUseCase.execute(userId);
      return reply.send(user);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  reactivate = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    try {
      const user = await this.reactivateUserUseCase.execute(userId);
      return reply.send(user);
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    const body = request.body as ChangePasswordDto;
    const requester = (request as FastifyRequest & { user: AuthenticatedUser }).user;

    try {
      await this.changePasswordUseCase.execute({
        userId,
        newPassword: body.newPassword,
        currentPassword: body.currentPassword,
        requesterIsAdmin: requester.roles.includes(RoleName.ADMIN),
      });
      return reply.send({ message: 'Password updated successfully' });
    } catch (error) {
      return this.handleError(error, reply);
    }
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = this.parseId(request, reply);
    if (userId === null) return;

    try {
      await this.deleteUserUseCase.execute(userId);
      return reply.status(204).send();
    } catch (error) {
      return this.handleError(error, reply);
    }
  };
}
