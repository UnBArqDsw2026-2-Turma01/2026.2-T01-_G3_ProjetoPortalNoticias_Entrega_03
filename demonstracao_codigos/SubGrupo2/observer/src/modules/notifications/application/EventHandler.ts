import type { DomainEvent } from "../domain/events/DomainEvent";

/**
 * GoF Observer — papel "Observer".
 * Quem quiser reagir a um evento implementa esta interface.
 */
export interface EventHandler<E extends DomainEvent = DomainEvent> {
  readonly eventType: E["type"];
  handle(event: E): Promise<void>;
}
