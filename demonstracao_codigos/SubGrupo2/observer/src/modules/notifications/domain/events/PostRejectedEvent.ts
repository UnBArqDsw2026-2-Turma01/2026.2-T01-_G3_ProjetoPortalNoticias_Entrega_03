import { DomainEvent } from "./DomainEvent";

export class PostRejectedEvent extends DomainEvent {
  static readonly TYPE = "PostRejected" as const;
  readonly type = PostRejectedEvent.TYPE;

  constructor(
    readonly postId: string,
    readonly postTitle: string,
    readonly authorId: string,
    readonly reason: string,
  ) {
    super();
  }
}
