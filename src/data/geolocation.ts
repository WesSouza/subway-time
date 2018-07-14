import { orderByDistance } from 'geolib';

import { getStations } from 'data/stations';
import { getCurrentPosition } from 'lib/geolocation';

export const getNearbyStations = (maxResults: number) => async (): Promise<
  string[]
> => {
  const [position, stations] = await Promise.all([
    getCurrentPosition(),
    getStations(),
  ]);
  const currentPosition = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  stations.forEach(station => {
    if (!station.latitude || !station.longitude) {
      console.log(station);
    }
  });
  const orderedCoordinates = orderByDistance(currentPosition, stations);
  return orderedCoordinates
    .map(({ key }) => stations[key].id)
    .slice(0, maxResults);
};
