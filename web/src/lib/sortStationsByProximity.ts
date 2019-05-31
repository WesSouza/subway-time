import { getDistance } from 'geolib';

import { IStation } from '~/state/station';

export const sortStationsByProximity = (
  stations: IStation[],
  latitude: number,
  longitude: number,
): IStation[] =>
  stations
    .slice()
    .sort(
      (a, b) =>
        getDistance({ latitude, longitude }, a) -
        getDistance({ latitude, longitude }, b),
    )
    .map(station => ({
      ...station,
      distance: getDistance(
        { latitude, longitude },
        { latitude: station.latitude, longitude: station.longitude },
      ),
    }));
