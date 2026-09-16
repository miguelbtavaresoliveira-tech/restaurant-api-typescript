import { Entity } from './Entity.js';

/**
 * Marcador para eventos de domínio. Hoje eles só são acumulados no
 * agregado (pullDomainEvents) — ainda não existe um dispatcher/event bus
 * ligado a isso. Quando precisar reagir a eles (ex.: enviar e-mail quando
 * a senha for trocada), essa é a próxima peça a implementar.
 */
export interface DomainEvent {
  occurredAt: Date;
}

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
