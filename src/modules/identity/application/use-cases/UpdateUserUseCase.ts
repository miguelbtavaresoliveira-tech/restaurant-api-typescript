import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { Email } from '../../domain/value-objects/Email.js';
import { Roles, RoleName } from '../../domain/value-objects/Role.js';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError.js';
import { toUserOutput, type UpdateUserInput, type UserOutput } from '../dtos/UserDtos.js';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, input: UpdateUserInput): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    if (input.name) user.rename(input.name);
    if (input.email) user.changeEmail(Email.create(input.email));
    if (input.roles) user.changeRoles(Roles.create(input.roles as RoleName[]));

    const updated = await this.userRepository.update(user);
    return toUserOutput(updated);
  }
}
