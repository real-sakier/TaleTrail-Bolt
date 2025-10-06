export enum FeatureFlag {
  MINIGAMES = 'minigames',
  LOCATION = 'location',
  QUESTS = 'quests',
  PACKS = 'packs',
  INVENTORY = 'inventory',
  PROFILE = 'profile',
}

export class FeatureFlags {
  private static enabledFeatures: Set<FeatureFlag> = new Set();

  static initialize(): void {
    const featuresEnv = process.env.EXPO_PUBLIC_ENABLED_FEATURES || '*';

    if (featuresEnv === '*') {
      Object.values(FeatureFlag).forEach((flag) => {
        this.enabledFeatures.add(flag);
      });
    } else {
      const features = featuresEnv.split(',').map((f) => f.trim());
      features.forEach((feature) => {
        if (Object.values(FeatureFlag).includes(feature as FeatureFlag)) {
          this.enabledFeatures.add(feature as FeatureFlag);
        }
      });
    }

    console.log('Feature flags initialized:', Array.from(this.enabledFeatures));
  }

  static isEnabled(feature: FeatureFlag): boolean {
    if (this.enabledFeatures.size === 0) {
      this.initialize();
    }
    return this.enabledFeatures.has(feature);
  }

  static enable(feature: FeatureFlag): void {
    this.enabledFeatures.add(feature);
  }

  static disable(feature: FeatureFlag): void {
    this.enabledFeatures.delete(feature);
  }

  static getEnabled(): FeatureFlag[] {
    if (this.enabledFeatures.size === 0) {
      this.initialize();
    }
    return Array.from(this.enabledFeatures);
  }

  static reset(): void {
    this.enabledFeatures.clear();
  }
}
