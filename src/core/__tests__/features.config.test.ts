import { FeatureFlags, FeatureFlag } from '../config/features.config';

describe('FeatureFlags', () => {
  beforeEach(() => {
    FeatureFlags.reset();
    delete process.env.EXPO_PUBLIC_ENABLED_FEATURES;
  });

  describe('initialization', () => {
    it('should enable all features when env is *', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = '*';
      FeatureFlags.initialize();

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.LOCATION)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.QUESTS)).toBe(true);
    });

    it('should enable only specified features', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = 'minigames,location';
      FeatureFlags.initialize();

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.LOCATION)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.QUESTS)).toBe(false);
    });

    it('should handle empty env variable', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = '';
      FeatureFlags.initialize();

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(false);
    });

    it('should auto-initialize on first isEnabled call', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = 'minigames';

      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
      expect(FeatureFlags.isEnabled(FeatureFlag.LOCATION)).toBe(false);
    });
  });

  describe('enable/disable', () => {
    it('should enable a feature', () => {
      FeatureFlags.enable(FeatureFlag.MINIGAMES);
      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(true);
    });

    it('should disable a feature', () => {
      FeatureFlags.enable(FeatureFlag.MINIGAMES);
      FeatureFlags.disable(FeatureFlag.MINIGAMES);
      expect(FeatureFlags.isEnabled(FeatureFlag.MINIGAMES)).toBe(false);
    });
  });

  describe('getEnabled', () => {
    it('should return all enabled features', () => {
      process.env.EXPO_PUBLIC_ENABLED_FEATURES = 'minigames,location';
      FeatureFlags.initialize();

      const enabled = FeatureFlags.getEnabled();
      expect(enabled).toContain(FeatureFlag.MINIGAMES);
      expect(enabled).toContain(FeatureFlag.LOCATION);
      expect(enabled).not.toContain(FeatureFlag.QUESTS);
    });
  });

  describe('reset', () => {
    it('should clear all enabled features', () => {
      FeatureFlags.enable(FeatureFlag.MINIGAMES);
      FeatureFlags.reset();

      expect(FeatureFlags.getEnabled()).toHaveLength(0);
    });
  });
});
