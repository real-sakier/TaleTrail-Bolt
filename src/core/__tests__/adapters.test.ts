import { SeedMinigameAdapter } from '../adapters/SeedMinigameAdapter';
import { MockMinigameAdapter } from '../adapters/MockMinigameAdapter';
import { SeedUserAdapter } from '../adapters/SeedUserAdapter';
import { MockUserAdapter } from '../adapters/MockUserAdapter';

describe('DataSource Adapters', () => {
  describe('SeedMinigameAdapter', () => {
    let adapter: SeedMinigameAdapter;

    beforeEach(() => {
      adapter = new SeedMinigameAdapter();
    });

    it('should return questions filtered by type and difficulty', async () => {
      const questions = await adapter.getQuestions('OSM_TRIVIA', 'EASY', 5);

      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(5);
      questions.forEach((q) => {
        expect(q.type).toBe('OSM_TRIVIA');
        expect(q.difficulty).toBe('EASY');
      });
    });

    it('should save and retrieve session history', async () => {
      const session = {
        id: 'test-session-1',
        userId: 'user-1',
        type: 'OSM_TRIVIA',
        difficulty: 'EASY',
        score: 5,
        totalQuestions: 5,
        accuracy: 100,
        timeElapsed: 60,
        xpEarned: 75,
        completedAt: new Date().toISOString(),
      };

      await adapter.saveSession(session);
      const history = await adapter.getSessionHistory('user-1');

      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(session);
    });

    it('should return empty array for non-existent user history', async () => {
      const history = await adapter.getSessionHistory('non-existent-user');
      expect(history).toEqual([]);
    });
  });

  describe('MockMinigameAdapter', () => {
    let adapter: MockMinigameAdapter;

    beforeEach(() => {
      adapter = new MockMinigameAdapter();
    });

    it('should return questions with correct count', async () => {
      const questions = await adapter.getQuestions('OSM_TRIVIA', 'EASY', 5);
      expect(questions).toHaveLength(5);
    });

    it('should generate mock questions when not enough exist', async () => {
      const questions = await adapter.getQuestions('TAG_PUZZLE', 'HARD', 10);
      expect(questions).toHaveLength(10);
    });

    it('should save and retrieve sessions', async () => {
      const session = {
        id: 'mock-session-1',
        userId: 'mock-user',
        type: 'OSM_TRIVIA',
        difficulty: 'MEDIUM',
        score: 3,
        totalQuestions: 5,
        accuracy: 60,
        timeElapsed: 90,
        xpEarned: 60,
        completedAt: new Date().toISOString(),
      };

      await adapter.saveSession(session);
      const history = await adapter.getSessionHistory('mock-user');

      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(session);
    });
  });

  describe('SeedUserAdapter', () => {
    let adapter: SeedUserAdapter;

    beforeEach(() => {
      adapter = new SeedUserAdapter();
    });

    it('should return existing seed user profile', async () => {
      const profile = await adapter.getProfile('seed-user-1');

      expect(profile).not.toBeNull();
      expect(profile?.username).toBe('SeedPlayer');
      expect(profile?.level).toBe(5);
    });

    it('should return null for non-existent user', async () => {
      const profile = await adapter.getProfile('non-existent');
      expect(profile).toBeNull();
    });

    it('should update user profile', async () => {
      const updated = await adapter.updateProfile('seed-user-1', {
        username: 'UpdatedPlayer',
      });

      expect(updated.username).toBe('UpdatedPlayer');
      expect(updated.level).toBe(5);
    });

    it('should add XP and update level correctly', async () => {
      const profile = await adapter.addXp('seed-user-1', 100);

      expect(profile.xp).toBe(350);
      expect(profile.totalXp).toBe(1350);
      expect(profile.level).toBe(14);
    });

    it('should throw error when updating non-existent user', async () => {
      await expect(
        adapter.updateProfile('non-existent', { username: 'Test' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('MockUserAdapter', () => {
    let adapter: MockUserAdapter;

    beforeEach(() => {
      adapter = new MockUserAdapter();
    });

    it('should return mock user profile', async () => {
      const profile = await adapter.getProfile('mock-user-1');

      expect(profile).not.toBeNull();
      expect(profile?.username).toBe('MockPlayer');
      expect(profile?.level).toBe(1);
    });

    it('should return null for different user ID', async () => {
      const profile = await adapter.getProfile('other-user');
      expect(profile).toBeNull();
    });

    it('should update mock user profile', async () => {
      const updated = await adapter.updateProfile('mock-user-1', {
        username: 'NewMockPlayer',
      });

      expect(updated.username).toBe('NewMockPlayer');
    });

    it('should add XP correctly', async () => {
      await adapter.addXp('mock-user-1', 150);
      const profile = await adapter.getProfile('mock-user-1');

      expect(profile?.xp).toBe(150);
      expect(profile?.totalXp).toBe(150);
      expect(profile?.level).toBe(2);
    });
  });
});
