import { NotificationHandler } from "../NotificationHandler";
import { PostApprovedEvent } from "../../domain/events/PostApprovedEvent";
import type { NotificationDraft } from "../../domain/Notification";
import type { FollowersRepository } from "../../domain/ports/FollowersRepository";
import type { NotificationRepository } from "../../domain/ports/NotificationRepository";
import type { WebChannel } from "../../domain/ports/WebChannel";

/** PostAprovado → avisa os seguidores da comunidade. */
export class NewPostHandler extends NotificationHandler<PostApprovedEvent> {
  readonly eventType = PostApprovedEvent.TYPE;

  constructor(
    notifications: NotificationRepository,
    channel: WebChannel,
    private readonly followers: FollowersRepository,
  ) {
    super(notifications, channel);
  }

  protected async resolveRecipients(event: PostApprovedEvent) {
    const ids = await this.followers.findFollowerIds(event.communityId);
    // o autor já recebe o aviso de aprovação; não duplicar
    return ids.filter((id) => id !== event.authorId);
  }

  protected buildMessage(event: PostApprovedEvent): NotificationDraft {
    return {
      type: "NEW_POST_IN_COMMUNITY",
      message: `Nova publicação em ${event.communityName}: ${event.postTitle}`,
      link: `/posts/${event.postId}`,
    };
  }
}
