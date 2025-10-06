import { IUserDataSource, UserProfile } from '../ports/datasource.port';

export class MockUserAdapter implements IUserDataSource {
  private mockProfile: UserProfile = {
    id: 'mock-user-1',
    username: 'MockPlayer',
    level: 1,
    xp: 0,
    totalXp: 0,
    createdAt: new Date().toISOString(),
  };

  async getProfile(userId: string): Promise<UserProfile | null> {
    if (userId === this.mockProfile.id) {
      return { ...this.mockProfile };
    }
    return null;
  }

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    if (userId !== this.mockProfile.id) {
      throw new Error('User not found');
    }

    this.mockProfile = { ...this.mockProfile, ...updates };
    return { ...this.mockProfile };
  }

  async addXp(userId: string, xp: number): Promise<UserProfile> {
    if (userId !== this.mockProfile.id) {
      throw new Error('User not found');
    }

    this.mockProfile.xp += xp;
    this.mockProfile.totalXp += xp;
    this.mockProfile.level = Math.floor(this.mockProfile.totalXp / 100) + 1;

    return { ...this.mockProfile };
  }
}
