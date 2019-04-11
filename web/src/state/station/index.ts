import { IEntities } from '~/lib/entities';
import { createState } from '~/lib/simple-state';

import { apiStations, apiStationPlatformsByStationId } from './api';
import {
  emptyFuture,
  errorFuture,
  IFuture,
  loadingFuture,
  valueFuture,
} from '~/lib/future';
import { sortStationsByProximity } from '~/lib/sortStationsByProximity';

// # Interfaces

export interface IStationState {
  currentStationId: string | null;
  nearbyStationIds: IFuture<string[]>;
  platformsByStationId: IEntities<IFuture<IStationPlatform[]>>;
  stationsById: IFuture<IEntities<IStation>>;
}

export interface IStation {
  id: string;
  name: string;
  lineIds: string[];
  latitude: number;
  longitude: number;
}

export interface IStationPlatform {
  lastUpdate: Date;
  lineId: string;
  directions: IStationPlatformDirection[];
}

export interface IStationPlatformDirection {
  name: string;
  times: IStationPlatformDirectionTime[];
}

export interface IStationPlatformDirectionTime {
  minutes: number | string;
  lastStationName: string;
}

// # State

export const stationState = createState<IStationState>({
  currentStationId: null,
  nearbyStationIds: emptyFuture(),
  platformsByStationId: {},
  stationsById: emptyFuture(),
});

// # Actions

const fetchStations = async () => {
  await stationState.set({
    stationsById: loadingFuture(),
  });

  try {
    const apiStationsById = await apiStations();
    await stationState.set({
      stationsById: valueFuture(apiStationsById),
    });
  } catch (error) {
    await stationState.set({
      stationsById: errorFuture(error),
    });
  }
};

const fetchStationPlatformsByStationId = async (stationId: string) => {
  await stationState.set(({ platformsByStationId }) => ({
    platformsByStationId: {
      ...platformsByStationId,
      [stationId]: loadingFuture(platformsByStationId[stationId]),
    },
  }));

  try {
    const platformsById: { [platformId: string]: IStationPlatform } = {};

    const platforms = await apiStationPlatformsByStationId(stationId);
    platforms.forEach(platform => {
      platformsById[platform.lineId] = platform;
    });

    await stationState.set(({ platformsByStationId }) => ({
      platformsByStationId: {
        ...platformsByStationId,
        [stationId]: valueFuture(platforms),
      },
    }));
  } catch (error) {
    await stationState.set(({ platformsByStationId }) => ({
      platformsByStationId: {
        ...platformsByStationId,
        [stationId]: errorFuture(error),
      },
    }));
  }
};

const handleCoordinatesUpdate = async (
  coordinatesFuture: IFuture<Coordinates>,
) => {
  const [coordinates, { error, loading }] = coordinatesFuture;
  if (!coordinates) {
    return;
  }

  if (error || loading) {
    await stationState.set(({ nearbyStationIds }) => ({
      nearbyStationIds: [nearbyStationIds[0], { error, loading }],
    }));
    return;
  }

  const { latitude, longitude } = coordinates;

  const { stationsById: stationsByIdFuture } = stationState.get();
  const [stationsById] = stationsByIdFuture;
  if (!stationsById) {
    return;
  }

  const stations = Object.values(stationsById);

  const localSortedStations = sortStationsByProximity(
    stations,
    latitude,
    longitude,
  ).slice(0, 5);

  await stationState.set({
    nearbyStationIds: valueFuture(
      localSortedStations.map(station => station.id),
    ),
  });
};

// # Exports

export const stationActions = {
  fetchStations,
  fetchStationPlatformsByStationId,
  handleCoordinatesUpdate,
};
