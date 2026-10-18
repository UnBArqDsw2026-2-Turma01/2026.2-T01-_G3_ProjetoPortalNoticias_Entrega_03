import { NotificationHandler } from "../NotificationHandler";
import { PostRejectedEvent } from "../../domain/events/PostRejectedEvent";
import type { NotificationDraft } from "../../domain/Notification";

/** PostReprovado → avisa o autor, com o motivo. */
export class RejectedHandler extends NotificationHandler<PostRejectedEvent> {
  readonly eventType = PostRejectedEvent.TYPE;

  protected async resolveRecipients(event: PostRejectedEvent) {
    return [event.authorId];
  }

  protected buildMessage(event: PostRejectedEvent): NotificationDraft {
    return {
      type: "POST_REJECTED",
      message: `Sua publicação "${event.postTitle}" foi reprovada. Motivo: ${event.reason}`,
      link: `/posts/${event.postId}/edit`,
    };
  }
}
