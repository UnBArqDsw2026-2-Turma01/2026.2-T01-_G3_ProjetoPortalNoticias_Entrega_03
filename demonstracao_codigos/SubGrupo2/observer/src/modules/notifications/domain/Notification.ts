export type NotificationType =
  | "NEW_POST_IN_COMMUNITY"
  | "POST_APPROVED"
  | "POST_REJECTED";

/** Conteúdo que um handler monta (ainda sem destinatário/id). */
export interface NotificationDraft {
  type: NotificationType;
  message: string;
  link: string;
}

export interface Notification extends NotificationDraft {
  id: string;
  recipientId: string;
  read: boolean;
  createdAt: Date;
}

export function createNotification(
  recipientId: string,
  draft: NotificationDraft,
): Notification {
  return {
    id: crypto.randomUUID(),
    recipientId,
    read: false,
    createdAt: new Date(),
    ...draft,
  };
}
