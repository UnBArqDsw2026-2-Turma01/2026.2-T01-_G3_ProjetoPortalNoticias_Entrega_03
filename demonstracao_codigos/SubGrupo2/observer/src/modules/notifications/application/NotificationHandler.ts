import type { DomainEvent } from "../domain/events/DomainEvent";
import {
  createNotification,
  type Notification,
  type NotificationDraft,
} from "../domain/Notification";
import type { NotificationRepository } from "../domain/ports/NotificationRepository";
import type { WebChannel } from "../domain/ports/WebChannel";
import type { EventHandler } from "./EventHandler";

/**
 * GoF Template Method — papel "AbstractClass".
 * handle() define a ORDEM dos passos (o template):
 *   1. resolveRecipients  (abstrato → varia por handler)
 *   2. buildMessage       (abstrato → varia por handler)
 *   3. persistAndSend     (concreto → igual para todos)
 *
 * Também é um "Observer" concreto: implementa EventHandler.
 * Subclasses NÃO devem sobrescrever handle().
 */
export abstract class NotificationHandler<E extends DomainEvent>
  implements EventHandler<E>
{
  abstract readonly eventType: E["type"];

  constructor(
    private readonly notifications: NotificationRepository,
    private readonly channel: WebChannel,
  ) {}

  /** Template method. */
  async handle(event: E): Promise<void> {
    const recipientIds = await this.resolveRecipients(event);
    if (recipientIds.length === 0) return;

    const draft = this.buildMessage(event);
    await this.persistAndSend(recipientIds, draft);
  }

  /** Operação primária 1: quem deve receber o aviso. */
  protected abstract resolveRecipients(event: E): Promise<string[]>;

  /** Operação primária 2: o conteúdo do aviso. */
  protected abstract buildMessage(event: E): NotificationDraft;

  /** Passo comum: salva e empurra para o navegador de cada destinatário. */
  private async persistAndSend(
    recipientIds: string[],
    draft: NotificationDraft,
  ): Promise<void> {
    const unique = [...new Set(recipientIds)];
    const created: Notification[] = unique.map((id) =>
      createNotification(id, draft),
    );

    await Promise.all(created.map((n) => this.notifications.save(n)));
    await Promise.all(created.map((n) => this.channel.push(n.recipientId, n)));
  }
}
