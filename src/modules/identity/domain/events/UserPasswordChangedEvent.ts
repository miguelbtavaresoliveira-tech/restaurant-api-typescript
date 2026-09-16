import type { DomainEvent } from '../../../../shared/domain/AggregateRoot.js';

export class UserPasswordChangedEvent implements DomainEvent {
  public readonly occurredAt = new Date();
  constructor(public readonly userId: number) {}
}
