import { IMailSender } from '../../domain/contracts/IMailSender.js';

/**
 * TODO: substituir por um provedor real (Resend, SES, SendGrid, etc.) antes de
 * ir pra produção. Por enquanto só loga o token no console pra dar pra testar
 * o fluxo de "esqueci minha senha" localmente.
 */
export class ConsoleMailSender implements IMailSender {
  async sendPasswordReset(to: string, rawToken: string): Promise<void> {
    console.log(`[mail] Reset de senha para ${to} -> token: ${rawToken}`);
  }
}
