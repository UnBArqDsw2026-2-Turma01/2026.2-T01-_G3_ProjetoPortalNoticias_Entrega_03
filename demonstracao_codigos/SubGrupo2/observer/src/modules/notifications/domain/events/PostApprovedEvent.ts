import { DomainEvent } from "./DomainEvent";

export class PostApprovedEvent extends DomainEvent {
  static readonly TYPE = "PostApproved" as const;
  readonly type = PostApprovedEvent.TYPE;

  constructor(
    readonly postId: string,
    readonly postTitle: string,
    readonly authorId: string,
    readonly communityId: string,
    readonly communityName: string,
  ) {
    super();
  }
}
