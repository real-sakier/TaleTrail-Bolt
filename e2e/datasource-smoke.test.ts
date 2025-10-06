import { DataSourceFactory } from '../src/core/providers/DataSourceFactory';
import { DataSourceMode } from '../src/core/ports/datasource.port';
import { FeatureFlags, FeatureFlag } from '../src/core/config/features.config';

describe('DataSource Smoke Tests', () => {
  beforeEach(() => {
    DataSourceFactory.clearCache();
    FeatureFlags.reset();
  });

  describe('SEED mode', () => {
    it('should fetch questions in seed mode', async () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      const questions = await adapter.getQuestions('OSM_TRIVIA', 'EASY', 5);

      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0]).toHaveProperty('question');
      expect(questions[0]).toHaveProperty('options');
      expect(questions[0]).toHaveProperty('correctAnswer');
    });

    it('should fetch user profile in seed mode', async () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.SEED);
      const profile = await adapter.getProfile('seed-user-1');

      expect(profile).not.toBeNull();
      expect(profile).toHaveProperty('username');
      expect(profile).toHaveProperty('level');
      expect(profile).toHaveProperty('xp');
    });

    it('should save minigame session in seed mode', async () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      const session = {
        id: 'smoke-test-1',
        userId: 'seed-user-1',
        type: 'OSM_TRIVIA',
        difficulty: 'EASY',
        score: 5,
        totalQuestions: 5,
        accuracy: 100,
        timeElapsed: 45,
        xpEarned: 75,
        completedAt: new Date().toISOString(),
      };

      await expect(adapter.saveSession(session)).resolves.not.toThrow();
    });
  });

  describe('MOCK mode', () => {
    it('should fetch questions in mock mode', async () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      const questions = await adapter.getQuestions('OSM_TRIVIA', 'EASY', 5);

      expect(questions).toHaveLength(5);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0]).toHaveProperty('question');
    });

    it('should fetch user profile in mock mode', async () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.MOCK);
      const profile = await adapter.getProfile('mock-user-1');

      expect(profile).not.toBeNull();
      expect(profile?.username).toBe('MockPlayer');
    });

    it('should save minigame session in mock mode', async () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      const session = {
        id: 'smoke-test-2',
        userId: 'mock-user-1',
        type: 'TAG_PUZZLE',
        difficulty: 'MEDIUM',
        score: 3,
        totalQuestions: 5,
        accuracy: 60,
        timeElapsed: 90,
        xpEarned: 60,
        completedAt: new Date().toISOString(),
      };

      await expect(adapter.saveSession(session)).resolves.not.toThrow();
    });
  });

  describe('LIVE mode', () => {
    it('should handle live mode gracefully when Supabase unavailable', async () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.LIVE,
      );
      const questions = await adapter.getQuestions('OSM_TRIVIA', 'EASY', 5);

      expect(Array.isArray(questions)).toBe(true);
    });

    it('should handle user profile fetch in live mode', async () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.LIVE);
      const profile = await adapter.getProfile('test-user');

      expect(profile === null || typeof profile === 'object').toBe(true);
    });
  });

  describe('Mode switching', () => {
    it('should switch between modes without errors', () => {
      const seedAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      expect(seedAdapter).toBeDefined();

      DataSourceFactory.clearCache();

      const mockAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      expect(mockAdapter).toBeDefined();
      expect(mockAdapter).not.toBe(seedAdapter);

      DataSourceFactory.clearCache();

      const liveAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.LIVE,
      );
      expect(liveAdapter).toBeDefined();
      expect(liveAdapter).not.toBe(seedAdapter);
      expect(liveAdapter).not.toBe(mockAdapter);
    });
  });

  describe('Feature Flags', () => {
    it('should enable all features with wildcard', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = '*';
      FeatureFlags.initialize();

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.LOCATION)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.QUESTS)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.PACKS)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.INVENTORY)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.PROFILE)).toBe(true);
    });

    it('should enable only specified features', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = 'minigames,location';
      FeatureFlags.initialize();

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.LOCATION)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.QUESTS)).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should work end-to-end in seed mode', async () => {
      const minigameAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      const userAdapter = DataSourceFactory.getUserDataSource(
        DataSourceMode.SEED,
      );

      const questions = await minigameAdapter.getQuestions(
        'OSM_TRIVIA',
        'EASY',
        5,
      );
      expect(questions.length).toBeGreaterThan(0);

      const profile = await userAdapter.getProfile('seed-user-1');
      expect(profile).not.toBeNull();

      const session = {
        id: 'integration-test',
        userId: 'seed-user-1',
        type: 'OSM_TRIVIA',
        difficulty: 'EASY',
        score: 5,
        totalQuestions: questions.length,
        accuracy: 100,
        timeElapsed: 60,
        xpEarned: 75,
        completedAt: new Date().toISOString(),
      };

      await minigameAdapter.saveSession(session);
      const history = await minigameAdapter.getSessionHistory('seed-user-1');
      expect(history.length).toBeGreaterThan(0);
    });
  });
});
