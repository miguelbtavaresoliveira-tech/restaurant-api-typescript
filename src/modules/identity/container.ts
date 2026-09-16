// Composição manual das dependências do módulo identity (sem framework de DI).
// Rotas e testes de integração importam os controllers já montados a partir daqui.
import { prisma } from '../../shared/infrastructure/database/prisma.js';

import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository.js';
import { PrismaRefreshTokenRepository } from './infrastructure/database/PrismaRefreshTokenRepository.js';
import { PrismaPasswordResetTokenRepository } from './infrastructure/database/PrismaPasswordResetTokenRepository.js';
import { BcryptHasher } from './infrastructure/security/BcryptHasher.js';
import { JwtProvider } from './infrastructure/security/JwtProvider.js';
import { ConsoleMailSender } from './infrastructure/mail/ConsoleMailSender.js';

import { AuthenticateUserUseCase } from './application/use-cases/AuthenticateUserUseCase.js';
import { LogoutUseCase } from './application/use-cases/LogoutUseCase.js';
import { RefreshTokenUseCase } from './application/use-cases/RefreshTokenUseCase.js';
import { RequestPasswordResetUseCase } from './application/use-cases/RequestPasswordResetUseCase.js';
import { ResetPasswordUseCase } from './application/use-cases/ResetPasswordUseCase.js';
import { RegisterStaffUseCase } from './application/use-cases/RegisterStaffUseCase.js';
import { ListUsersUseCase } from './application/use-cases/ListUsersUseCase.js';
import { GetUserByIdUseCase } from './application/use-cases/GetUserByIdUseCase.js';
import { UpdateUserUseCase } from './application/use-cases/UpdateUserUseCase.js';
import { DeactivateUserUseCase } from './application/use-cases/DeactivateUserUseCase.js';
import { ReactivateUserUseCase } from './application/use-cases/ReactivateUserUseCase.js';
import { ChangePasswordUseCase } from './application/use-cases/ChangePasswordUseCase.js';
import { DeleteUserUseCase } from './application/use-cases/DeleteUserUseCase.js';

import { AuthController } from './presentation/http/AuthController.js';
import { UserController } from './presentation/http/UserController.js';

const userRepository = new PrismaUserRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository(prisma);
const hasher = new BcryptHasher();
const jwtProvider = new JwtProvider();
const mailSender = new ConsoleMailSender();

const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, refreshTokenRepository, hasher, jwtProvider);
const logoutUseCase = new LogoutUseCase(refreshTokenRepository, hasher, jwtProvider);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, refreshTokenRepository, hasher, jwtProvider);
const requestPasswordResetUseCase = new RequestPasswordResetUseCase(
  userRepository,
  passwordResetTokenRepository,
  hasher,
  jwtProvider,
  mailSender,
);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordResetTokenRepository, hasher, jwtProvider);

const registerStaffUseCase = new RegisterStaffUseCase(userRepository, hasher);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deactivateUserUseCase = new DeactivateUserUseCase(userRepository, refreshTokenRepository);
const reactivateUserUseCase = new ReactivateUserUseCase(userRepository);
const changePasswordUseCase = new ChangePasswordUseCase(userRepository, hasher);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export const authController = new AuthController(
  authenticateUserUseCase,
  logoutUseCase,
  refreshTokenUseCase,
  requestPasswordResetUseCase,
  resetPasswordUseCase,
);

export const userController = new UserController(
  registerStaffUseCase,
  listUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deactivateUserUseCase,
  reactivateUserUseCase,
  changePasswordUseCase,
  deleteUserUseCase,
);
