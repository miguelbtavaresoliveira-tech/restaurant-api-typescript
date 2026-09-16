/**
 * Erro base para regras de negócio violadas dentro do domínio.
 * `status` é um "hint" de HTTP status para a camada de apresentação
 * traduzir o erro sem o domínio precisar saber o que é HTTP.
 */
export abstract class DomainError extends Error {
  public readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
