import type { FollowersRepository } from "../domain/ports/FollowersRepository";

export class InMemoryFollowersRepository implements FollowersRepository {
  constructor(private readonly byCommunity: Record<string, string[]>) {}

  async findFollowerIds(communityId: string) {
    return this.byCommunity[communityId] ?? [];
  }
}
