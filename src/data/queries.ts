import { getRawSubwayStations, getRawTimesByLineId } from 'api/api';

import { IStation } from 'models/models';

export const getStationWithTimes = async ({
  stationId,
}: {
  stationId: string;
}): Promise<IStation> => {
  const [rawStationsAll, rawStationTimes] = await Promise.all([
    getRawSubwayStations(),
    getRawTimesByLineId(stationId),
  ]);
  const rawStations = rawStationsAll.filter(({ id }) => id === stationId);
  if (!rawStations) {
    throw new Error('Unable to find station.');
  }

  const [primaryStation] = rawStations;

  return {
    id: stationId,
    name: primaryStation.name,
    boroughName: primaryStation.boroughName,
    coordinates: primaryStation.coordinates,
    lines: rawStations.map(({ lineId, lineColor }) => ({
      id: lineId,
      color: lineColor,
    })),
    platforms: rawStations.map(({ lineId, lineColor, status, type }) => ({
      line: {
        id: lineId,
        color: lineColor,
      },
      status,
      type,
      directions: rawStationTimes[lineId],
    })),
  };
};
