export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface LocationPosition {
  coords: Coordinates;
  timestamp: number;
}

export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

export interface LocationPermission {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export enum LocationErrorCode {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  LOCATION_DISABLED = 'LOCATION_DISABLED',
  UNKNOWN = 'UNKNOWN',
}

export class LocationError extends Error {
  constructor(
    public code: LocationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'LocationError';
  }
}

export interface ILocationService {
  requestPermission(): Promise<LocationPermission>;
  getCurrentPosition(): Promise<LocationPosition>;
  checkPermission(): Promise<LocationPermission>;
  isLocationEnabled(): Promise<boolean>;
}
