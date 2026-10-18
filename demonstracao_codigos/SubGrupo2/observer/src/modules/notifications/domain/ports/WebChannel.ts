import type { Notification } from "../Notification";

/** Entrega em tempo real ao navegador (SSE, WebSocket...). */
export interface WebChannel {
  push(recipientId: string, notification: Notification): Promise<void>;
}
