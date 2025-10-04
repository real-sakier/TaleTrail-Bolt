import { useState, useCallback, useEffect } from 'react';
import type {
  ILocationService,
  LocationPosition,
  LocationPermission,
} from '../../../core/ports/location.port';
import {
  PermissionStatus,
  LocationError,
  LocationErrorCode,
} from '../../../core/ports/location.port';
import { ExpoLocationAdapter } from '../../../core/adapters/ExpoLocationAdapter';
import { MockLocationAdapter } from '../../../core/adapters/MockLocationAdapter';

const USE_MOCK = process.env.EXPO_PUBLIC_DATASOURCE === 'mock';

const locationService: ILocationService = USE_MOCK
  ? new MockLocationAdapter('berlin')
  : new ExpoLocationAdapter();

export interface UseLocationState {
  position: LocationPosition | null;
  permission: LocationPermission | null;
  isLoading: boolean;
  error: LocationError | null;
}

export interface UseLocationActions {
  requestPermission: () => Promise<void>;
  getCurrentPosition: () => Promise<LocationPosition>;
  checkPermission: () => Promise<LocationPermission>;
  clearError: () => void;
}

export function useLocation(): UseLocationState & UseLocationActions {
  const [position, setPosition] = useState<LocationPosition | null>(null);
  const [permission, setPermission] = useState<LocationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const perm = await locationService.checkPermission();
      setPermission(perm);
      return perm;
    } catch (err) {
      const locationError =
        err instanceof LocationError
          ? err
          : new LocationError(
              LocationErrorCode.UNKNOWN,
              err instanceof Error ? err.message : 'Unknown error',
            );
      setError(locationError);
      throw locationError;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const perm = await locationService.requestPermission();
      setPermission(perm);

      if (perm.status !== PermissionStatus.GRANTED) {
        throw new LocationError(
          LocationErrorCode.PERMISSION_DENIED,
          'Standort-Berechtigung wurde verweigert',
        );
      }
    } catch (err) {
      const locationError =
        err instanceof LocationError
          ? err
          : new LocationError(
              LocationErrorCode.UNKNOWN,
              err instanceof Error ? err.message : 'Unknown error',
            );
      setError(locationError);
      throw locationError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentPosition = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pos = await locationService.getCurrentPosition();
      setPosition(pos);
      return pos;
    } catch (err) {
      const locationError =
        err instanceof LocationError
          ? err
          : new LocationError(
              LocationErrorCode.POSITION_UNAVAILABLE,
              err instanceof Error ? err.message : 'Unknown error',
            );
      setError(locationError);
      throw locationError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    position,
    permission,
    isLoading,
    error,
    requestPermission,
    getCurrentPosition,
    checkPermission,
    clearError,
  };
}
