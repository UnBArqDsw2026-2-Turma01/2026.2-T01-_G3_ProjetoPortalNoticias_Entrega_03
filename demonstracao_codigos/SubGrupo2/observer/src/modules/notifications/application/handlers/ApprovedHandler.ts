import { NotificationHandler } from "../NotificationHandler";
import { PostApprovedEvent } from "../../domain/events/PostApprovedEvent";
import type { NotificationDraft } from "../../domain/Notification";

/** PostAprovado → avisa o autor. */
export class ApprovedHandler extends NotificationHandler<PostApprovedEvent> {
  readonly eventType = PostApprovedEvent.TYPE;

  protected async resolveRecipients(event: PostApprovedEvent) {
    return [event.authorId];
  }

  protected buildMessage(event: PostApprovedEvent): NotificationDraft {
    return {
      type: "POST_APPROVED",
      message: `Sua publicação "${event.postTitle}" foi aprovada em ${event.communityName}.`,
      link: `/posts/${event.postId}`,
    };
  }
}
