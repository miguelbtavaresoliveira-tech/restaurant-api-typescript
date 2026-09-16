import { User } from '../entities/User.js';
import { Email } from '../value-objects/Email.js';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
