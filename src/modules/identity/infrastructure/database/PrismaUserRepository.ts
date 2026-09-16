import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { Email } from '../../domain/value-objects/Email.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const created = await this.prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }

  async findById(id: number): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email: email.value } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany();
    return rows.map(UserMapper.toDomain);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const updated = await this.prisma.user.update({ where: { id: user.id as number }, data });
    return UserMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
