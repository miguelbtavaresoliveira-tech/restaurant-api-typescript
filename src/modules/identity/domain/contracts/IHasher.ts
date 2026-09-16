/** Porta de domínio para hashing — implementada em infrastructure/security/BcryptHasher.ts. */
export interface IHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
