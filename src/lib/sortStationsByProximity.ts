import { getDistance } from 'geolib';

import { Station } from '~/state/station/types';

export const sortStationsByProximity = (
  stations: Station[],
  latitude: number,
  longitude: number,
): Station[] =>
  stations
    .slice()
    .sort(
      (a, b) =>
        getDistance({ latitude, longitude }, a) -
        getDistance({ latitude, longitude }, b),
    )
    .map((station) => ({
      ...station,
      distance: getDistance(
        { latitude, longitude },
        { latitude: station.latitude, longitude: station.longitude },
      ),
    }));
