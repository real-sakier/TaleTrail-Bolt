import { DataSourceFactory } from '../providers/DataSourceFactory';
import { DataSourceMode } from '../ports/datasource.port';
import { SeedMinigameAdapter } from '../adapters/SeedMinigameAdapter';
import { MockMinigameAdapter } from '../adapters/MockMinigameAdapter';
import { LiveMinigameAdapter } from '../adapters/LiveMinigameAdapter';
import { SeedUserAdapter } from '../adapters/SeedUserAdapter';
import { MockUserAdapter } from '../adapters/MockUserAdapter';
import { LiveUserAdapter } from '../adapters/LiveUserAdapter';

describe('DataSourceFactory', () => {
  beforeEach(() => {
    DataSourceFactory.clearCache();
  });

  describe('getMinigameDataSource', () => {
    it('should return SeedMinigameAdapter for SEED mode', () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      expect(adapter).toBeInstanceOf(SeedMinigameAdapter);
    });

    it('should return MockMinigameAdapter for MOCK mode', () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      expect(adapter).toBeInstanceOf(MockMinigameAdapter);
    });

    it('should return LiveMinigameAdapter for LIVE mode', () => {
      const adapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.LIVE,
      );
      expect(adapter).toBeInstanceOf(LiveMinigameAdapter);
    });

    it('should cache adapter instances per mode', () => {
      const adapter1 = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      const adapter2 = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      expect(adapter1).toBe(adapter2);
    });

    it('should return different instances for different modes', () => {
      const seedAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      const mockAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      expect(seedAdapter).not.toBe(mockAdapter);
    });
  });

  describe('getUserDataSource', () => {
    it('should return SeedUserAdapter for SEED mode', () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.SEED);
      expect(adapter).toBeInstanceOf(SeedUserAdapter);
    });

    it('should return MockUserAdapter for MOCK mode', () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.MOCK);
      expect(adapter).toBeInstanceOf(MockUserAdapter);
    });

    it('should return LiveUserAdapter for LIVE mode', () => {
      const adapter = DataSourceFactory.getUserDataSource(DataSourceMode.LIVE);
      expect(adapter).toBeInstanceOf(LiveUserAdapter);
    });

    it('should cache adapter instances per mode', () => {
      const adapter1 = DataSourceFactory.getUserDataSource(
        DataSourceMode.SEED,
      );
      const adapter2 = DataSourceFactory.getUserDataSource(
        DataSourceMode.SEED,
      );
      expect(adapter1).toBe(adapter2);
    });
  });

  describe('clearCache', () => {
    it('should clear cached adapters', () => {
      const adapter1 = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      DataSourceFactory.clearCache();
      const adapter2 = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      expect(adapter1).not.toBe(adapter2);
    });
  });

  describe('mode switching', () => {
    it('should return correct adapters after switching modes', () => {
      const seedAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.SEED,
      );
      expect(seedAdapter).toBeInstanceOf(SeedMinigameAdapter);

      DataSourceFactory.clearCache();

      const mockAdapter = DataSourceFactory.getMinigameDataSource(
        DataSourceMode.MOCK,
      );
      expect(mockAdapter).toBeInstanceOf(MockMinigameAdapter);
      expect(mockAdapter).not.toBe(seedAdapter);
    });
  });
});
