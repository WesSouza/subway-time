import { orderByDistance } from 'geolib';

import { IStation } from '~/state/station';

export const sortStationsByProximity = (
  stations: IStation[],
  latitude: number,
  longitude: number,
): IStation[] =>
  orderByDistance({ latitude, longitude }, stations).map(
    ({ distance, key }) => ({
      ...stations[Number(key)],
      distance,
    }),
  );
