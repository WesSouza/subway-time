import { StationState } from './types';

export function getCurrentStationId(stationState: StationState) {
  return stationState.currentStationId;
}

export function getNearbyStationIds(stationState: StationState) {
  return stationState.nearbyStationIds;
}

export function getPlatformsByStationId(stationState: StationState) {
  return stationState.platformsByStationId;
}

export function getStationsById(stationState: StationState) {
  return stationState.stationsById;
}
