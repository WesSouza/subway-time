import { Entities } from '~/lib/entities';
import { Future } from '~/lib/future';

export interface StationState {
  currentStationId: string | null;
  nearbyStationIds: Future<string[]>;
  platformsByStationId: Entities<Future<StationPlatform[]>>;
  stationsById: Future<Entities<Station>>;
}

export interface Station {
  id: string;
  name: string;
  lineIds: string[];
  latitude: number;
  longitude: number;
  keywords: string[];
}

export interface StationPlatform {
  lastUpdate: Date;
  lineId: string;
  directions: StationPlatformDirection[];
}

export interface StationPlatformDirection {
  name: string;
  times: StationPlatformDirectionTime[];
}

export interface StationPlatformDirectionTime {
  minutes: number | string;
  lastStationName: string;
}
