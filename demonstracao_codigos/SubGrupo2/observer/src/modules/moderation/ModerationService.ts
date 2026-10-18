import { PostApprovedEvent } from "../notifications/domain/events/PostApprovedEvent";
import { PostRejectedEvent } from "../notifications/domain/events/PostRejectedEvent";
import type { EventBus } from "../notifications/application/EventBus";

export interface Post {
  id: string;
  title: string;
  authorId: string;
  communityId: string;
  communityName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/** Stand-in do repositório real de posts (troque pelo banco do projeto). */
export class InMemoryPostRepository {
  constructor(private readonly posts: Post[]) {}
  async findById(id: string) {
    return this.posts.find((p) => p.id === id) ?? null;
  }
  async findPending() {
    return this.posts.filter((p) => p.status === "PENDING");
  }
  async save(post: Post) {
    const i = this.posts.findIndex((p) => p.id === post.id);
    if (i >= 0) this.posts[i] = post;
  }
}

/**
 * Só conhece o EventBus (Subject). Não importa nada de handlers,
 * canal web ou repositório de notificações.
 */
export class ModerationService {
  constructor(
    private readonly posts: InMemoryPostRepository,
    private readonly bus: EventBus,
  ) {}

  async approve(postId: string) {
    const post = await this.requirePending(postId);
    await this.posts.save({ ...post, status: "APPROVED" });
    await this.bus.publish(
      new PostApprovedEvent(
        post.id,
        post.title,
        post.authorId,
        post.communityId,
        post.communityName,
      ),
    );
  }

  async reject(postId: string, reason: string) {
    const post = await this.requirePending(postId);
    await this.posts.save({ ...post, status: "REJECTED" });
    await this.bus.publish(
      new PostRejectedEvent(post.id, post.title, post.authorId, reason),
    );
  }

  pending() {
    return this.posts.findPending();
  }

  private async requirePending(postId: string) {
    const post = await this.posts.findById(postId);
    if (!post) throw new Error("Post não encontrado");
    if (post.status !== "PENDING") throw new Error("Post já foi moderado");
    return post;
  }
}
