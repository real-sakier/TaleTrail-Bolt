import type {
  ILocationService,
  LocationPermission,
  LocationPosition,
} from '../ports/location.port';
import {
  PermissionStatus,
  LocationError,
  LocationErrorCode,
} from '../ports/location.port';

export interface MockLocationConfig {
  latitude: number;
  longitude: number;
  simulatePermissionDenied?: boolean;
  simulateLocationDisabled?: boolean;
  simulateTimeout?: boolean;
}

const DEFAULT_LOCATIONS: Record<string, MockLocationConfig> = {
  berlin: { latitude: 52.52, longitude: 13.405 },
  munich: { latitude: 48.1351, longitude: 11.582 },
  hamburg: { latitude: 53.5511, longitude: 9.9937 },
  cologne: { latitude: 50.9375, longitude: 6.9603 },
};

export class MockLocationAdapter implements ILocationService {
  private config: MockLocationConfig;
  private permissionGranted: boolean = false;

  constructor(config?: Partial<MockLocationConfig> | keyof typeof DEFAULT_LOCATIONS) {
    if (typeof config === 'string') {
      this.config = DEFAULT_LOCATIONS[config] || DEFAULT_LOCATIONS.berlin;
    } else {
      this.config = {
        latitude: config?.latitude ?? DEFAULT_LOCATIONS.berlin.latitude,
        longitude: config?.longitude ?? DEFAULT_LOCATIONS.berlin.longitude,
        simulatePermissionDenied: config?.simulatePermissionDenied ?? false,
        simulateLocationDisabled: config?.simulateLocationDisabled ?? false,
        simulateTimeout: config?.simulateTimeout ?? false,
      };
    }
  }

  async checkPermission(): Promise<LocationPermission> {
    if (this.config.simulatePermissionDenied) {
      return {
        status: PermissionStatus.DENIED,
        canAskAgain: true,
      };
    }

    return {
      status: this.permissionGranted
        ? PermissionStatus.GRANTED
        : PermissionStatus.UNDETERMINED,
      canAskAgain: !this.permissionGranted,
    };
  }

  async requestPermission(): Promise<LocationPermission> {
    if (this.config.simulatePermissionDenied) {
      return {
        status: PermissionStatus.DENIED,
        canAskAgain: false,
      };
    }

    this.permissionGranted = true;
    return {
      status: PermissionStatus.GRANTED,
      canAskAgain: false,
    };
  }

  async isLocationEnabled(): Promise<boolean> {
    return !this.config.simulateLocationDisabled;
  }

  async getCurrentPosition(): Promise<LocationPosition> {
    if (this.config.simulateTimeout) {
      throw new LocationError(
        LocationErrorCode.TIMEOUT,
        'Mock timeout',
      );
    }

    const permission = await this.checkPermission();
    if (permission.status !== PermissionStatus.GRANTED) {
      throw new LocationError(
        LocationErrorCode.PERMISSION_DENIED,
        'Mock permission denied',
      );
    }

    const isEnabled = await this.isLocationEnabled();
    if (!isEnabled) {
      throw new LocationError(
        LocationErrorCode.LOCATION_DISABLED,
        'Mock location disabled',
      );
    }

    return {
      coords: {
        latitude: this.config.latitude,
        longitude: this.config.longitude,
        accuracy: 10,
        altitude: 100,
        altitudeAccuracy: 5,
        heading: 0,
        speed: 0,
      },
      timestamp: Date.now(),
    };
  }

  setLocation(latitude: number, longitude: number): void {
    this.config.latitude = latitude;
    this.config.longitude = longitude;
  }
}
