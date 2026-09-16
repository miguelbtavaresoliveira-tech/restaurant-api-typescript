import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { Email } from '../../domain/value-objects/Email.js';
import { Roles, RoleName } from '../../domain/value-objects/Role.js';
import { User } from '../../domain/entities/User.js';
import { EmailAlreadyInUseError } from '../../domain/errors/EmailAlreadyInUseError.js';
import { toUserOutput, type CreateUserInput, type UserOutput } from '../dtos/UserDtos.js';

/** Antes era um placeholder vazio (createUser). Implementado por completo aqui. */
export class RegisterStaffUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const email = Email.create(input.email);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const passwordHash = await this.hasher.hash(input.password);
    const roles = Roles.create(input.roles as RoleName[]);

    const user = User.create({ name: input.name, email, passwordHash, roles }, 0);
    const created = await this.userRepository.create(user);

    return toUserOutput(created);
  }
}
