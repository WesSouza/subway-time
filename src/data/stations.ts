import { getRawSubwayStations, getRawTimesByLineId } from 'api/api';

import sortByObjectKey from 'lib/sortByObjectKey';

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
  if (!rawStations.length) {
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

let getStationsCache: IStation[];
export const getStations = async (): Promise<IStation[]> => {
  if (getStationsCache) {
    return getStationsCache;
  }

  const rawStations = await getRawSubwayStations();
  const stations: IStation[] = [];

  const stationsIndexById = {};

  rawStations.forEach(rawStation => {
    const {
      id,
      name,
      boroughName,
      coordinates,
      lineId,
      lineColor,
      status,
      type,
    } = rawStation;

    if (stationsIndexById[id]) {
      const index = stationsIndexById[id];

      stations[index].lines.push({
        id: lineId,
        color: lineColor,
      });
      stations[index].lineIds += lineId;
      stations[index].lineIds = (stations[index].lineIds as string)
        .split('')
        .sort()
        .join('');
      stations[index].lines.sort(sortByObjectKey('id'));

      stations[index].platforms.push({
        line: {
          id: lineId,
          color: lineColor,
        },
        status,
        type,
      });

      return;
    }

    stationsIndexById[id] = stations.length;

    stations.push({
      id,
      name,
      boroughName,
      coordinates,
      lines: [
        {
          id: lineId,
          color: lineColor,
        },
      ],
      lineIds: lineId,
      platforms: [
        {
          line: {
            id: lineId,
            color: lineColor,
          },
          status,
          type,
        },
      ],
    });
  });

  stations.sort(sortByObjectKey('name'));

  getStationsCache = stations;
  return stations;
};

export const searchStations = async ({
  search,
}: {
  search: string;
}): Promise<IStation[]> => {
  const stations = await getStations();
  let searchLineId = false;

  const searchCleaned = search
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '\\s+');
  let searchRegex = new RegExp(`(^|\\s+)${searchCleaned}`, 'i');

  if (search.length === 1 && search.match(/[a-z]/i)) {
    searchLineId = true;
    searchRegex = new RegExp(searchCleaned, 'i');
  }

  return stations.filter(
    station =>
      searchLineId && station.lineIds
        ? station.lineIds.match(searchRegex)
        : station.name.match(searchRegex),
  );
};
