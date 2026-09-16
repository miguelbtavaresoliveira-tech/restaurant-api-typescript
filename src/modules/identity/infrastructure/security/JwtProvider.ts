import jwt from 'jsonwebtoken';
import { IJwtProvider, TokenPayload, PasswordResetPayload } from '../../domain/contracts/IJwtProvider.js';

/**
 * Reimplementado a partir dos imports originais
 * (`shared/lib/jwt.ts` — signToken/signRefreshToken/verifyToken — que não veio
 * nos arquivos enviados). Se a implementação que você já tem usa segredos/
 * expirações diferentes, ajuste as constantes abaixo para bater com o que já
 * está em produção (senão os tokens antigos param de validar).
 */
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string;
const RESET_TOKEN_SECRET = process.env.JWT_RESET_SECRET ?? ACCESS_TOKEN_SECRET;

export class JwtProvider implements IJwtProvider {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  }

  signPasswordResetToken(payload: PasswordResetPayload): string {
    return jwt.sign(payload, RESET_TOKEN_SECRET, { expiresIn: '15m' });
  }

  verifyPasswordResetToken(token: string): PasswordResetPayload {
    return jwt.verify(token, RESET_TOKEN_SECRET) as PasswordResetPayload;
  }
}
