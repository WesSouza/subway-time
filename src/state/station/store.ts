import { emptyFuture } from '~/src/lib/future';
import { StateManager } from '~/src/lib/StateManager';

import { StationState } from './types';

export const stationStore = new StateManager<StationState>({
  currentStationId: null,
  nearbyStationIds: emptyFuture(),
  platformsByStationId: {},
  stationsById: emptyFuture(),
});
