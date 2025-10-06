import { IUserDataSource, UserProfile } from '../ports/datasource.port';

export class SeedUserAdapter implements IUserDataSource {
  private profiles: Map<string, UserProfile> = new Map([
    [
      'seed-user-1',
      {
        id: 'seed-user-1',
        username: 'SeedPlayer',
        level: 5,
        xp: 250,
        totalXp: 1250,
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.profiles.get(userId) || null;
  }

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const existing = this.profiles.get(userId);
    if (!existing) {
      throw new Error('User not found');
    }

    const updated = { ...existing, ...updates };
    this.profiles.set(userId, updated);
    return updated;
  }

  async addXp(userId: string, xp: number): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('User not found');
    }

    const newXp = profile.xp + xp;
    const newTotalXp = profile.totalXp + xp;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    return this.updateProfile(userId, {
      xp: newXp,
      totalXp: newTotalXp,
      level: newLevel,
    });
  }
}
