import { EventBus } from "@/modules/notifications/application/EventBus";
import { NewPostHandler } from "@/modules/notifications/application/handlers/NewPostHandler";
import { ApprovedHandler } from "@/modules/notifications/application/handlers/ApprovedHandler";
import { RejectedHandler } from "@/modules/notifications/application/handlers/RejectedHandler";
import { InMemoryNotificationRepository } from "@/modules/notifications/infra/InMemoryNotificationRepository";
import { InMemoryFollowersRepository } from "@/modules/notifications/infra/InMemoryFollowersRepository";
import { SseWebChannel } from "@/modules/notifications/infra/SseWebChannel";
import {
  InMemoryPostRepository,
  ModerationService,
} from "@/modules/moderation/ModerationService";

/**
 * ÚNICO lugar que conhece todas as classes concretas:
 * monta o grafo de dependências e inscreve os Observers no Subject.
 */
export function buildContainer() {
  const notifications = new InMemoryNotificationRepository();
  const followers = new InMemoryFollowersRepository({
    tech: ["ana", "bruno", "carla"],
    games: ["bruno"],
  });
  const channel = new SseWebChannel();

  const bus = new EventBus();
  bus.subscribe(new NewPostHandler(notifications, channel, followers));
  bus.subscribe(new ApprovedHandler(notifications, channel));
  bus.subscribe(new RejectedHandler(notifications, channel));

  const posts = new InMemoryPostRepository([
    { id: "p1", title: "Novo framework lançado", authorId: "ana", communityId: "tech", communityName: "Tecnologia", status: "PENDING" },
    { id: "p2", title: "Review do jogo do ano", authorId: "ana", communityId: "games", communityName: "Games", status: "PENDING" },
  ]);
  const moderation = new ModerationService(posts, bus);

  return { bus, notifications, channel, moderation };
}

export type Container = ReturnType<typeof buildContainer>;

/** Singleton que sobrevive ao hot-reload do Next em desenvolvimento. */
const g = globalThis as unknown as { __container?: Container };
export function getContainer(): Container {
  return (g.__container ??= buildContainer());
}
