import type { DomainEvent } from "../domain/events/DomainEvent";
import type { EventHandler } from "./EventHandler";

/**
 * GoF Observer — papel "Subject".
 * Guarda os observers inscritos por tipo de evento e os notifica em publish().
 * Quem publica (ex.: ModerationService) nunca conhece quem escuta.
 */
export class EventBus {
  private readonly handlers = new Map<string, EventHandler<any>[]>();

  subscribe<E extends DomainEvent>(handler: EventHandler<E>): () => void {
    const list = this.handlers.get(handler.eventType) ?? [];
    list.push(handler);
    this.handlers.set(handler.eventType, list);
    return () => this.unsubscribe(handler);
  }

  unsubscribe<E extends DomainEvent>(handler: EventHandler<E>): void {
    const list = this.handlers.get(handler.eventType) ?? [];
    this.handlers.set(
      handler.eventType,
      list.filter((h) => h !== handler),
    );
  }

  /**
   * Notifica todos os observers do tipo do evento.
   * allSettled: se um handler falhar, os demais ainda rodam e
   * a moderação (quem publicou) não é afetada.
   */
  async publish(event: DomainEvent): Promise<void> {
    const list = this.handlers.get(event.type) ?? [];
    const results = await Promise.allSettled(list.map((h) => h.handle(event)));
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          `[EventBus] handler #${i} falhou para ${event.type}:`,
          r.reason,
        );
      }
    });
  }
}
