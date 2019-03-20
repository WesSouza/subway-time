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

// # Interfaces

export interface IStationState {
  currentStationId: string | null;
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
      [stationId]: loadingFuture(),
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

// # Exports

export const stationActions = {
  fetchStations,
  fetchStationPlatformsByStationId,
};
