/** Porta de domínio para envio de e-mail — implementada em infrastructure/mail. */
export interface IMailSender {
  sendPasswordReset(to: string, rawToken: string): Promise<void>;
}
