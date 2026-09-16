import type { DomainEvent } from '../../../../shared/domain/AggregateRoot.js';

export class UserStatusChangedEvent implements DomainEvent {
  public readonly occurredAt = new Date();
  constructor(
    public readonly userId: number,
    public readonly isActive: boolean,
  ) {}
}
