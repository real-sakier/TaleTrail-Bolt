import { DataSourceMode } from '../ports/datasource.port';
import type {
  IMinigameDataSource,
  IUserDataSource,
} from '../ports/datasource.port';
import { SeedMinigameAdapter } from '../adapters/SeedMinigameAdapter';
import { MockMinigameAdapter } from '../adapters/MockMinigameAdapter';
import { LiveMinigameAdapter } from '../adapters/LiveMinigameAdapter';
import { SeedUserAdapter } from '../adapters/SeedUserAdapter';
import { MockUserAdapter } from '../adapters/MockUserAdapter';
import { LiveUserAdapter } from '../adapters/LiveUserAdapter';

export class DataSourceFactory {
  private static minigameAdapterCache: Map<DataSourceMode, IMinigameDataSource> =
    new Map();
  private static userAdapterCache: Map<DataSourceMode, IUserDataSource> =
    new Map();

  static getMinigameDataSource(mode: DataSourceMode): IMinigameDataSource {
    if (!this.minigameAdapterCache.has(mode)) {
      let adapter: IMinigameDataSource;

      switch (mode) {
        case DataSourceMode.SEED:
          adapter = new SeedMinigameAdapter();
          break;
        case DataSourceMode.MOCK:
          adapter = new MockMinigameAdapter();
          break;
        case DataSourceMode.LIVE:
          adapter = new LiveMinigameAdapter();
          break;
        default:
          adapter = new SeedMinigameAdapter();
      }

      this.minigameAdapterCache.set(mode, adapter);
    }

    return this.minigameAdapterCache.get(mode)!;
  }

  static getUserDataSource(mode: DataSourceMode): IUserDataSource {
    if (!this.userAdapterCache.has(mode)) {
      let adapter: IUserDataSource;

      switch (mode) {
        case DataSourceMode.SEED:
          adapter = new SeedUserAdapter();
          break;
        case DataSourceMode.MOCK:
          adapter = new MockUserAdapter();
          break;
        case DataSourceMode.LIVE:
          adapter = new LiveUserAdapter();
          break;
        default:
          adapter = new SeedUserAdapter();
      }

      this.userAdapterCache.set(mode, adapter);
    }

    return this.userAdapterCache.get(mode)!;
  }

  static clearCache(): void {
    this.minigameAdapterCache.clear();
    this.userAdapterCache.clear();
  }
}
