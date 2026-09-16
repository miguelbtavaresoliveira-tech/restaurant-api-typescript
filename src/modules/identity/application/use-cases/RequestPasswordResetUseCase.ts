import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { IPasswordResetTokenRepository } from '../../domain/repositories/IPasswordResetTokenRepository.js';
import { IHasher } from '../../domain/contracts/IHasher.js';
import { IJwtProvider } from '../../domain/contracts/IJwtProvider.js';
import { IMailSender } from '../../domain/contracts/IMailSender.js';
import { Email } from '../../domain/value-objects/Email.js';
import { PasswordResetToken } from '../../domain/entities/PasswordResetToken.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos

/**
 * NOVO — implementação completa do fluxo "esqueci minha senha" que no código
 * original estava desativado (`forgotPassword` retornava 410 Gone).
 *
 * Requer uma tabela nova no schema.prisma (veja PrismaPasswordResetTokenRepository.ts
 * para o modelo sugerido) e um provedor de e-mail de verdade em produção
 * (ver infrastructure/mail/ConsoleMailSender.ts).
 */
export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
    private readonly hasher: IHasher,
    private readonly jwtProvider: IJwtProvider,
    private readonly mailSender: IMailSender,
  ) {}

  async execute(rawEmail: string): Promise<void> {
    let email: Email;
    try {
      email = Email.create(rawEmail);
    } catch {
      return; // resposta idêntica ao "sucesso" — não revela se o e-mail é válido
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) return; // idem — evita enumeração de usuários por e-mail

    const rawToken = this.jwtProvider.signPasswordResetToken({ id: user.id as number });
    const tokenHash = await this.hasher.hash(rawToken);

    const resetToken = PasswordResetToken.create(
      { userId: user.id as number, tokenHash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
      0,
    );

    await this.resetTokenRepository.create(resetToken);
    await this.mailSender.sendPasswordReset(email.value, rawToken);
  }
}
