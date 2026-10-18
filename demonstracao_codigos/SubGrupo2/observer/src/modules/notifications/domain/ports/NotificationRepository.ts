import type { Notification } from "../Notification";

export interface NotificationRepository {
  save(notification: Notification): Promise<void>;
  findByRecipient(recipientId: string): Promise<Notification[]>;
  markAsRead(notificationId: string, recipientId: string): Promise<boolean>;
}
