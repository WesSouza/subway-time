import { errorFuture, Future, loadingFuture, valueFuture } from '~/lib/future';
import { sortStationsByProximity } from '~/lib/sortStationsByProximity';

import { apiStationPlatformsByStationId, apiStations } from './api';
import { stationStore } from './store';
import { StationPlatform } from './types';

export async function fetchStations() {
  stationStore.mutate(state => {
    state.stationsById = loadingFuture();
  });

  try {
    const apiStationsById = await apiStations();
    stationStore.mutate(state => {
      state.stationsById = valueFuture(apiStationsById);
    });
  } catch (error) {
    stationStore.mutate(state => {
      state.stationsById = errorFuture(error);
    });
  }
}

export async function fetchStationPlatformsByStationId(stationId: string) {
  stationStore.mutate(state => {
    state.platformsByStationId[stationId] = loadingFuture(
      state.platformsByStationId[stationId],
    );
  });

  try {
    const platformsById: { [platformId: string]: StationPlatform } = {};

    const platforms = await apiStationPlatformsByStationId(stationId);
    platforms.forEach(platform => {
      platformsById[platform.lineId] = platform;
    });

    stationStore.mutate(state => {
      state.platformsByStationId[stationId] = valueFuture(platforms);
    });
  } catch (error) {
    stationStore.mutate(state => {
      state.platformsByStationId[stationId] = errorFuture(error);
    });
  }
}

export async function handleCoordinatesUpdate(
  coordinatesFuture: Future<Coordinates>,
) {
  const [coordinates, { error, loading }] = coordinatesFuture;
  if (!coordinates) {
    return;
  }

  if (error || loading) {
    stationStore.mutate(state => {
      state.nearbyStationIds = [state.nearbyStationIds[0], { error, loading }];
    });
    return;
  }

  const { latitude, longitude } = coordinates;

  const { stationsById: stationsByIdFuture } = stationStore.state;
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

  stationStore.mutate(state => {
    state.nearbyStationIds = valueFuture(
      localSortedStations.map(station => station.id),
    );
  });
}
