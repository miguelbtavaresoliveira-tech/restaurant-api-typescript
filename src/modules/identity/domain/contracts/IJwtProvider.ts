export interface TokenPayload {
  id: number;
  roles: string[];
}

export interface PasswordResetPayload {
  id: number;
}

/** Porta de domínio para emissão/verificação de tokens — implementada em infrastructure/security/JwtProvider.ts. */
export interface IJwtProvider {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verify(token: string): TokenPayload;

  signPasswordResetToken(payload: PasswordResetPayload): string;
  verifyPasswordResetToken(token: string): PasswordResetPayload;
}
