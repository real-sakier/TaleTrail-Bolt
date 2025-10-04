import * as Location from 'expo-location';
import type {
  ILocationService,
  LocationPermission,
  LocationPosition,
  Coordinates,
} from '../ports/location.port';
import {
  PermissionStatus,
  LocationError,
  LocationErrorCode,
} from '../ports/location.port';

export class ExpoLocationAdapter implements ILocationService {
  private mapPermissionStatus(
    status: Location.PermissionStatus,
  ): PermissionStatus {
    switch (status) {
      case Location.PermissionStatus.GRANTED:
        return PermissionStatus.GRANTED;
      case Location.PermissionStatus.DENIED:
        return PermissionStatus.DENIED;
      default:
        return PermissionStatus.UNDETERMINED;
    }
  }

  private mapCoordinates(
    coords: Location.LocationObjectCoords,
  ): Coordinates {
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy ?? undefined,
      altitude: coords.altitude ?? undefined,
      altitudeAccuracy: coords.altitudeAccuracy ?? undefined,
      heading: coords.heading ?? undefined,
      speed: coords.speed ?? undefined,
    };
  }

  async checkPermission(): Promise<LocationPermission> {
    try {
      const { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();
      return {
        status: this.mapPermissionStatus(status),
        canAskAgain,
      };
    } catch (error) {
      throw new LocationError(
        LocationErrorCode.UNKNOWN,
        `Permission check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async requestPermission(): Promise<LocationPermission> {
    try {
      const { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      return {
        status: this.mapPermissionStatus(status),
        canAskAgain,
      };
    } catch (error) {
      throw new LocationError(
        LocationErrorCode.PERMISSION_DENIED,
        `Permission request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch {
      return false;
    }
  }

  async getCurrentPosition(): Promise<LocationPosition> {
    const permission = await this.checkPermission();
    if (permission.status !== PermissionStatus.GRANTED) {
      throw new LocationError(
        LocationErrorCode.PERMISSION_DENIED,
        'Location permission not granted',
      );
    }

    const isEnabled = await this.isLocationEnabled();
    if (!isEnabled) {
      throw new LocationError(
        LocationErrorCode.LOCATION_DISABLED,
        'Location services are disabled',
      );
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        coords: this.mapCoordinates(location.coords),
        timestamp: location.timestamp,
      };
    } catch (error) {
      if (error instanceof LocationError) {
        throw error;
      }

      throw new LocationError(
        LocationErrorCode.POSITION_UNAVAILABLE,
        `Failed to get position: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
