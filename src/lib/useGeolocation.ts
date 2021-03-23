import { getDistance } from 'geolib';
import { useEffect, useState } from 'react';

import { Future, FutureLoading } from './future';

export enum GeolocationErrors {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
}

const GeolocationErrorsMap: { [id: string]: string } = {
  '1': GeolocationErrors.PERMISSION_DENIED,
  '2': GeolocationErrors.POSITION_UNAVAILABLE,
  '3': GeolocationErrors.TIMEOUT,
};

export const useGeolocation = (
  {
    updateMinimumDistance = 0,
  }: {
    updateMinimumDistance: number;
  } = { updateMinimumDistance: 0 },
): Future<GeolocationCoordinates> => {
  const [
    currentCoordinates,
    setCurrentCoordinates,
  ] = useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = useState<FutureLoading | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const success = (position: GeolocationPosition) => {
      if (
        !currentCoordinates ||
        updateMinimumDistance === 0 ||
        getDistance(
          {
            latitude: currentCoordinates.latitude,
            longitude: currentCoordinates.longitude,
          },
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        ) >= updateMinimumDistance
      ) {
        setCurrentCoordinates(position.coords);
        setError(null);
        setLoading(null);
      }
    };

    const error = (error: GeolocationPositionError) => {
      setCurrentCoordinates(null);
      setError(new Error(GeolocationErrorsMap[String(error.code)]));
      setLoading(null);
    };

    const watchId = navigator.geolocation.watchPosition(success, error);
    setLoading({ isLoading: true });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [currentCoordinates, updateMinimumDistance]);

  return [currentCoordinates, { error, loading }];
};
