import type { Notification } from "../domain/Notification";
import type { WebChannel } from "../domain/ports/WebChannel";

type Send = (chunk: string) => void;

/**
 * Canal web via Server-Sent Events.
 * Cada aba aberta do usuário registra uma conexão.
 */
export class SseWebChannel implements WebChannel {
  private readonly connections = new Map<string, Set<Send>>();

  connect(userId: string, send: Send): () => void {
    const set = this.connections.get(userId) ?? new Set<Send>();
    set.add(send);
    this.connections.set(userId, set);
    return () => {
      set.delete(send);
      if (set.size === 0) this.connections.delete(userId);
    };
  }

  async push(recipientId: string, notification: Notification) {
    const payload = `event: notification\ndata: ${JSON.stringify(notification)}\n\n`;
    this.connections.get(recipientId)?.forEach((send) => {
      try {
        send(payload);
      } catch {
        /* conexão fechada; o cleanup do stream remove */
      }
    });
  }
}
