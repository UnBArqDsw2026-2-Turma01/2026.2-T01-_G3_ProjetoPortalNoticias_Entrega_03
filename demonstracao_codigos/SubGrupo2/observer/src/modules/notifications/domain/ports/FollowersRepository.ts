export interface FollowersRepository {
  findFollowerIds(communityId: string): Promise<string[]>;
}
