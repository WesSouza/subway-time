import { emptyFuture } from '~/lib/future';
import { StateManager } from '~/lib/StateManager';

import { StationState } from './types';

export const stationStore = new StateManager<StationState>({
  currentStationId: null,
  nearbyStationIds: emptyFuture(),
  platformsByStationId: {},
  stationsById: emptyFuture(),
});
