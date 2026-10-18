import type { Notification } from "../domain/Notification";
import type { NotificationRepository } from "../domain/ports/NotificationRepository";

/** Troque por Prisma/Drizzle/etc. sem tocar em handlers. */
export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly items: Notification[] = [];

  async save(n: Notification) {
    this.items.push(n);
  }

  async findByRecipient(recipientId: string) {
    return this.items
      .filter((n) => n.recipientId === recipientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(id: string, recipientId: string) {
    const n = this.items.find((x) => x.id === id && x.recipientId === recipientId);
    if (!n) return false;
    n.read = true;
    return true;
  }
}
